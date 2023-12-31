
import { addResponseMessage, Widget, toggleMsgLoader } from 'react-chat-widget'
import { useEffect, useRef, useState } from 'react';
import { Tinted, API, PromptAtom, PromptResponseAtom } from 'protolib';
import { useTimeout, useWindowSize } from 'usehooks-ts';
import { useAtom } from 'jotai';

const Chat = ({ tags = [],  zIndex=1, onScreen=true}: any) => {
    const [first, setFirst] = useState(true)
    const [lastMessage, setLastMessage] = useAtom(PromptResponseAtom)

    const chatContainer = useRef()
    const scrollToBottom = () => {
        const chatContainer = document.querySelector('.rcw-messages-container');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };

    // Función que se llama cuando una imagen se carga
    const onImageLoad = (img) => {
        const parent = img.parentNode.parentNode.parentNode;

        const floatingImage = document.createElement('img');
        floatingImage.src = '/images/youtube-play.svg';


        floatingImage.style.width = `${img.offsetWidth}px`;
        floatingImage.style.height = `${img.offsetHeight}px`;


        floatingImage.style.position = 'absolute';
        // floatingImage.style.opacity = '0.5';
        floatingImage.style.transformOrigin = 'center';
        floatingImage.style.transform = 'scale(0.20)';
        floatingImage.style.cursor = 'Pointer'
        floatingImage.style.pointerEvents = 'none';

        floatingImage.style.left = '15px';
        floatingImage.style.top = '15px';

        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        parent.appendChild(floatingImage);
    };

    useEffect(() => {
        // Configuración del MutationObserver
        const mutationObserver = new MutationObserver(mutations => {

            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains('rcw-message') || node.classList.contains('rcw-conversation-container'))) {
                            const images = node.getElementsByClassName("rcw-message-img");
                            for (let img of images) {
                                if(img.complete) {
                                    onImageLoad(img)
                                    scrollToBottom()
                                    for (let i = 1; i < 11; i++) {
                                        setTimeout(() => scrollToBottom(), i * 100);
                                    }                                
                                } else {
                                    img.addEventListener('load', () => {
                                        scrollToBottom()
                                        for (let i = 1; i < 11; i++) {
                                            setTimeout(() => scrollToBottom(), i * 100);
                                        }
                                        onImageLoad(img)
                                    });
                                }
                            }
                        }
                    });
                }
            });
        });

        const chatContainer = document.querySelector('body');
        if (chatContainer) {
            mutationObserver.observe(chatContainer, { childList: true, subtree: true });
        }

        return () => {
            mutationObserver.disconnect();
        };
    }, []);

    const getResources = async () => {
        console.log('requesting: ', '/adminapi/v1/resources?search=tags:' + tags.join(','));
        const resources = await API.get('/adminapi/v1/resources?search=tags:' + tags.join(','));

        if (resources.isLoaded && resources.data.items && resources.data.items.length) {
            const promises = resources.data.items.map(async (resource) => {
                if (resource.type == 'text') {
                    const content = await API.get(resource.url, undefined, true);
                    return content.data
                } else if (resource.type == 'youtube') {
                    const parts = resource.url.split('=')
                    if (parts.length < 2) return null
                    const yId = parts[1]

                    return '[![video](https://img.youtube.com/vi/' + yId + '/0.jpg)](' + resource.url + ' "Video Title")' + "\n" + resource.description
                }

                return null;
            });

            const results = await Promise.all(promises);
            return results.filter(result => result !== null);
        }
        return [];
    };

    const getInitialMessages = async () => {
        const resources = await getResources()
        resources.forEach(resource => addResponseMessage(resource))
        if(!lastMessage){
            const message = "I'm here to help you. Feel free to ask questions about the system."
            addResponseMessage(message)
            setLastMessage(message)
        } 
    }

    const { width, height } = useWindowSize()

    // useEffect(()=> {
    //     //@ts-ignore
    //     if(chatContainer.current && chatContainer.current.firstChild  && position.bottom == position.top && position.bottom) {
    //         console.log('position:', position, positioned)
    //         setPositioned(position)
    //     }
    // }, [position])

    function removeCommandFromString(originalString) {
        // This regular expression matches a command at the beginning of the string
        let regex = /^\/\S+/;
        return originalString.replace(regex, "").trim();
    }

    useEffect(()=> {
        if(chatContainer.current) {
            const position = chatContainer.current.getBoundingClientRect()
            //@ts-ignore
            if(chatContainer.current && chatContainer.current.firstChild  && position.bottom == position.top && position.bottom) {
                //@ts-ignore
                chatContainer.current.firstChild.style.bottom = -(height - position.top)+'px'
                //@ts-ignore
                chatContainer.current.firstChild.style.right =  -(width - position.right)+'px'
            }
        }
    }, [width, height])

    for(var i=0;i<20;i++) {
        useTimeout(() => {
            if(chatContainer.current) {
                const position = chatContainer.current.getBoundingClientRect()
                //@ts-ignore
                if(chatContainer.current && chatContainer.current.firstChild  && position.bottom == position.top && position.bottom) {
                    //@ts-ignore
                    chatContainer.current.firstChild.style.bottom = -(height - position.top)+'px'
                    //@ts-ignore
                    chatContainer.current.firstChild.style.right =  -(width - position.right)+'px'
                }
            }
        }, i*50)
    }

    const [promptChain] = useAtom(PromptAtom)


    const [promptResponse, setPromptResponse] = useAtom(PromptResponseAtom)

    return (
        <Tinted>
            <div ref={chatContainer} onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.preventDefault()} style={{transform: 'none', zIndex: zIndex, bottom: 0, right: 0,position: "fixed" }}>
                <div style={{position:'absolute'}}>
                    <Widget
                        title="Asistant"
                        subtitle="Get help, ideas and documentation"
                        handleNewUserMessage={async (message) => {
                            //generate prompts
                            console.log('Prompt chain: ', promptChain)
                            const isCommand = message.startsWith('/')
                            const isHelp = message.startsWith('/help')
                            
                            const prompt = promptChain.reduce((total, current) => total + (isHelp?current.generateCommand(message, total):current.generate(message, total)), '') + (
                                isHelp? `
]

End of command list.

The user wants to know the list of available commands. Include all the commands in the reply, and include a small description of the command. use the field action for the description of what the command does, but summarize it. 
`: isCommand?`

------
request: ${removeCommandFromString(message)}`:`
reply directly to the user, acting as the assistant.

The question of the user for the assistant is:
"${message}".`
)
                            console.log('prompt: ', prompt)

                            toggleMsgLoader();
                            const result = await API.post('/adminapi/v1/assistants', {
                                messages: [{role: 'user', content: prompt}],
                                best_of: 4,
                                temperature: isHelp?0:1
                            })
                            toggleMsgLoader();
                            console.log('result: ', result)
                            if(result.isError) {
                                addResponseMessage("Error generating response: ", result.error)
                            } else if (result.data.error) {
                                var errorMsg = result.data.error.message
                                if (result.data.error.code == "invalid_api_key") {
                                    errorMsg = errorMsg + '\nPlease add your key on "apps/admin-api/.env": \nOPENAI_API_KEY={YOUR KEY HERE}'
                                }
                                addResponseMessage(errorMsg)
                            } else {
                                addResponseMessage(result.data.choices[0].message.content)
                                setPromptResponse(result.data.choices[0].message.content)
                            }

                        }}
                        handleToggle={async (state) => {
                            if (state) {
                                if(first) {
                                    setFirst(false)
                                    toggleMsgLoader()
                                    await getInitialMessages()
                                    // setTimeout(() => scrollToBottom(), 500)
                                    toggleMsgLoader()
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </Tinted>
    )
}

export default Chat;

//<Connector brokerUrl={brokerUrl}>