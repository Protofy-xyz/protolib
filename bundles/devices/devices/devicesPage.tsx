import React, { useState, useEffect } from "react";
import { AdminPage, PaginatedDataSSR } from 'protolib/adminpanel/features/next'
import { BookOpen, Tag, Router } from '@tamagui/lucide-icons';
import { DevicesModel } from './devicesSchemas';
import { API, DataTable2, DataView, ButtonSimple } from 'protolib'
import { z } from 'zod';
import { DeviceDefinitionModel } from '../deviceDefinitions';
import { connectSerialPort, flash } from "../devicesUtils";
import { Connector, useMqttState, useSubscription } from 'mqtt-react-hooks';
import DeviceModal from 'protodevice/src/DeviceModal'
import deviceFunctions from 'protodevice/src/device'

const MqttTest = ({onSetStage,onSetModalFeedback}) => {
  const { message } = useSubscription(['device/compile']);
  useEffect(() => {
    console.log("Compile Message: ", message);
    try {
      if (message?.message) {
        const data = JSON.parse(message?.message.toString());
        if (data.event == 'exit' && data.code == 0) {
          console.log("Succesfully compiled");
          onSetStage('upload')
        } else if (data.event == 'exit' && data.code != 0) {
          console.error('Error compiling')
          onSetModalFeedback({ message: `Error compiling code. Please check your flow configuration.`, details: { error: true } })
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [message])
  return <></>
}

const DevicesIcons = { name: Tag, deviceDefinition: BookOpen }

const callText = async (url: string, method: string, params?: string, token?: string): Promise<any> => {
  var fetchParams: any = {
    method: method,
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    }
  }


  if (params) {
    fetchParams.body = params;
  }

  let separator = '?';
  if (url.indexOf('?') != -1) {
    separator = '&';
  }

  var defUrl = url + (token ? separator + "token=" + token : "");
  console.log("Deff URL: ", defUrl)
  return fetch(defUrl, fetchParams)
    .then(function (response) {
      if (response.status == 200) {
        return "ok";
      } console.log(response.status);
      if (!response.ok) {
      }
      return response;
    })
}

export default {
  component: ({ pageState, sourceUrl, initialItems, itemData, pageSession, extraData }: any) => {

    if (typeof window !== 'undefined') {
      Object.keys(deviceFunctions).forEach(k => (window as any)[k] = deviceFunctions[k])
    } else {
      console.log("Errror")
    }
    const [showModal, setShowModal] = useState(false)
    const [modalFeedback, setModalFeedback] = useState<any>()
    const [stage, setStage] = useState('')
    const yamlRef = React.useRef()
    // const { message } = useSubscription(['device/compile']);

    const flashDevice = async (deviceName, deviceDefinitionId) => {
      console.log("Flash device: ", { deviceName, deviceDefinitionId });

      const response = await API.get('/adminapi/v1/deviceDefinitions/' + deviceDefinitionId);
      if (response.isError) {
        alert(response.error)
        return;
      }
      const deviceDefinition = response.data
      const response1 = await API.get('/adminapi/v1/deviceBoards/' + deviceDefinition.board);
      if (response1.isError) {
        alert(response1.error)
        return;
      }
      console.log("---------deviceDefinition----------", deviceDefinition)
      deviceDefinition.board = response1.data
      const jsCode = deviceDefinition.config.components;
      const deviceCode = 'device(' + jsCode + ')';
      console.log("-------DEVICE CODE------------", deviceCode)
      const deviceObj = eval(deviceCode)
      const yaml = deviceObj.setMqttPrefix("newplatform").create(deviceName, deviceDefinition)
      yamlRef.current = yaml

      setShowModal(true)
      try {
        setStage('yaml')
      } catch (e) {
        console.error('error writting firmware: ', e)
      }
      //const deviceObj = eval(deviceCode)
    }
    const sendMessage = async (notUsed) => {
      await fetch('https://firmware.protofy.xyz/api/v1/device/compile')
    }

    const compile = async () => {
      setModalFeedback({ message: `Compiling firmware...`, details: { error: false } })
      const compileMsg = { type: "spawn", configuration: "test.yaml" };
      sendMessage(JSON.stringify(compileMsg));
    }

    const flashCb = (msgObj) => {
      console.log(msgObj);
      setModalFeedback(state => state = msgObj)
    }

    const onSelectPort = async () => {
      const isError = await connectSerialPort()
      if (isError) return
      setStage('write')
    }

    const saveYaml = async (yaml) => {
      console.log("Save Yaml")
      console.log(await callText("https://firmware.protofy.xyz/api/v1/device/edit?configuration=test.yaml", 'POST', yaml));
    }

    useEffect(() => {
      const process = async () => {
        if (stage == 'yaml') {
          await saveYaml(yamlRef.current)
          setStage('compile')
        } else if (stage == 'compile') {
          console.log("stage - compile")
          await compile()
        } else if (stage == 'write') {
          try {
            await flash(flashCb)
            setStage('idle')
          } catch (e) { flashCb({ message: 'Error writing the device. Check that the USB connection and serial port are correctly configured.', details: { error: true } }) }
        } else if (stage == 'upload') {
          // getWebSocket()?.close()
          const chromiumBasedAgent =
            (navigator.userAgent.includes('Chrome') ||
              navigator.userAgent.includes('Edge') ||
              navigator.userAgent.includes('Opera'))

          if (chromiumBasedAgent) {
            setModalFeedback({ message: 'Connect your device and click select to chose the port. ', details: { error: false } })
            console.log('chormium based true')
          } else {
            console.log('chormium based very false')
            setModalFeedback({ message: 'You need Chrome, Opera or Edge to upload the code to the device.', details: { error: true } })
          }
        }
      }
      process()
    }, [stage])


    // useEffect(() => {
    //   console.log("Compile Message: ", message);
    //   try {
    //     if (message?.message) {
    //       const data = JSON.parse(message?.message.toString());
    //       if (data.event == 'exit' && data.code == 0) {
    //         console.log("Succesfully compiled");
    //         setStage('upload')

    //       } else if (data.event == 'exit' && data.code != 0) {
    //         console.error('Error compiling')
    //         setModalFeedback({ message: `Error compiling code. Please check your flow configuration.`, details: { error: true } })
    //       }
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }, [message])

    return (<AdminPage title="Devices" pageSession={pageSession}>
      <Connector brokerUrl="wss://firmware.protofy.xyz/ws">
        <DeviceModal stage={stage} onCancel={() => setShowModal(false)} onSelect={onSelectPort} modalFeedback={modalFeedback} showModal={showModal} />
        <MqttTest onSetStage={(v)=>setStage(v)} setModalFeedback={(v)=>setModalFeedback(v)}/>
      </Connector>
      <DataView
        itemData={itemData}
        rowIcon={Router}
        sourceUrl={sourceUrl}
        initialItems={initialItems}
        numColumnsForm={1}
        name="device"
        onAdd={data => { return data }}
        onEdit={data => { return data }}
        columns={DataTable2.columns(
          DataTable2.column("name", "name", true),
          DataTable2.column("device definition", "deviceDefinition", true),
          DataTable2.column("config", "config", false, (row) => <ButtonSimple onPress={(e) => { flashDevice(row.name, row.deviceDefinition); }}>Upload</ButtonSimple>)
        )}
        extraFieldsForms={{
          deviceDefinition: z.union(extraData.deviceDefinitions.map(o => z.literal(o))).after('name').display(),
        }}
        model={DevicesModel}
        pageState={pageState}
        icons={DevicesIcons}
        dataTableGridProps={{ itemMinWidth: 300, spacing: 20 }}
      />
    </AdminPage>)
  },
  getServerSideProps: PaginatedDataSSR('/adminapi/v1/devices', ['admin', 'editor'], {}, async () => {
    const deviceDefinitions = await API.get('/adminapi/v1/deviceDefinitions?itemsPerPage=1000')
    return {
      deviceDefinitions: deviceDefinitions.isLoaded ? deviceDefinitions.data.items.map(i => DeviceDefinitionModel.load(i).getId()) : []
    }
  })
}