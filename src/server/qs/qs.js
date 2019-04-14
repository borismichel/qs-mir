const myCubes = require('./qs_cubes');
const config = require('../config/config');
const enigma  = require('enigma.js');
const schema  = require('enigma.js/schemas/12.34.11.json');
const webSocket = require('ws');

//get Server Certificates

//Certificate Loader
// const root  = [fs.readFileSync((config.qlikCertificateDir + 'root.pem'))];
// const key   = fs.readFileSync((config.qlikCertificateDir + 'client_key.pem'));
// const client = fs.readFileSync((config.qlikCertificateDir + 'client.pem'));

// session.on('traffic:sent', data => console.log('sent:', data));
// session.on('traffic:received', data => console.log('received:', data));

export async function qsPullMasterItems (appid) {

    const session = await enigma.create({
        schema,
        url: config.qlikServer,
        createSocket: url => new webSocket(url,{
            // ca: root, < Uncomment when on Server
            // key: key, < Uncomment when on Server
            // cert: client, < Uncomment when on Server
            headers: {
                'X-Qlik-User': config.qlikUser
            },
        })
    });

    const global = await session.open();
    const app = await global.openDoc(appid);

    let getMeasures = async function() {
        let obj = await app.createSessionObject(myCubes.msre);
        let layout = await obj.getLayout();                        
        
        return layout.qMeasureList.qItems;
    }
    let getDimensions = async function() {
        let obj = await app.createSessionObject(myCubes.dims);
        let layout = await obj.getLayout();
        
        return layout.qDimensionList.qItems;    
    }

    let result = await Promise.all([getMeasures(), getDimensions()]);
            
    app.session.close();
    session.close();

    return result;
};

export async function qsPullAndMapMasterItems (appid) {
    try {
        const session = await enigma.create({
            schema,
            url: config.qlikServer,
            createSocket: url => new webSocket(url,{
                // ca: root, < Uncomment when on Server
                // key: key, < Uncomment when on Server
                // cert: client, < Uncomment when on Server
                headers: {
                    'X-Qlik-User': config.qlikUser
                },
            })
        });

        const global = await session.open();
        const app = await global.openDoc(appid);
        //Get Measures
        console.log('Getting Details for ', appid);
        let getMeasureDetails = async function () {
            let obj =       await app.createSessionObject(myCubes.msre);
            var layout =    await obj.getLayout();
            
            return await Promise.all(
                layout.qMeasureList.qItems.map((measure) => {
                    let getDetails = async function() {
                        let msrObj = await app.getMeasure(measure.qInfo.qId);
                        let layout = await msrObj.getLayout();
                        let returnObject = {
                            id:     layout.qInfo.qId,
                            label:  layout.qMeasure.qLabel,
                            def:    layout.qMeasure.qDef,
                            title:  layout.qMeta.title,
                            desc:   layout.qMeta.description,
                            layout: layout
                        };                                  
                        return returnObject;
                    }
                    return getDetails();
                })
            );
        }

        //Get Dimesnions
        let getDimensionDetails = async function () {
            console.log('Getting Dims')
            let obj = await app.createSessionObject(myCubes.dims);
            let layout = await obj.getLayout();
            
            return await Promise.all(
                layout.qDimensionList.qItems.map((dimension) => {
                    let getDetails = async function () {
                        let dimObj = await app.getDimension(dimension.qInfo.qId);
                        let layout = await dimObj.getLayout();
                        let returnObject = {
                            id:     layout.qInfo.qId,
                            label:  layout.qDim.qFieldLabels[0],
                            def:    layout.qDim.qFieldDefs[0],
                            title:  layout.qMeta.title,
                            desc:   layout.qMeta.description,
                            layout: layout
                        };                                  
                        return returnObject;
                    }
                    return getDetails();
                })
            )
        }

        let result = await Promise.all([getMeasureDetails(),getDimensionDetails()]);

        app.session.close(); //Close App
        session.close();

        return result;

    } catch(error) {
        console.error(error)
    }
};

export async function qsGetDocList() {
    const session = await enigma.create({
        schema,
        url: config.qlikServer,
        createSocket: url => new webSocket(url,{
            // ca: root, < Uncomment when on Server
            // key: key, < Uncomment when on Server
            // cert: client, < Uncomment when on Server
            headers: {
                'X-Qlik-User': config.qlikUser
            },
        })
    });

    let global = await session.open();
    let list = await global.getDocList()
    session.close();
    return list;
}