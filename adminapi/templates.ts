import * as fs from 'fs';
import {templates} from 'app/templates'
import {connectDB, handler, app} from 'protolib/api'

console.log(`API Module loaded: ${__filename.split('.')[0]}`);

app.post('/adminapi/v1/templates/:tplname', handler(async (req, res) => {
    const tplname = req.params.tplname;
    const params = req.body

    if(!templates[tplname]) {
        throw "No such template: "+tplname
    }
    
    const name = params.name.replace(/[^a-zA-Z0-9_-]/g, '');
    const path = params.data.path.replace(/\.\./g, '')
    const fullpath = '../..'+path+"/"+name
    console.log('Executing template: ', tplname, 'in: ', fullpath, 'with vars: ', params)
    await templates[tplname]({connectDB, fs},fullpath, params)

    res.send({"result":"created"})
    return
}));
