const myCubes = require('./qs_cubes');
const config = require('../config/config');
const enigma  = require('enigma.js');
const schema  = require('enigma.js/schemas/12.34.11.json');
const webSocket = require('ws');

const db = require('../db/db');

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
        let getMeasureDetails = async function () {
            let obj =       await app.createSessionObject(myCubes.msre);
            var layout =    await obj.getLayout();
            
            return await Promise.all(
                layout.qMeasureList.qItems.map((measure) => {
                    let getDetails = async function() {
                        let msrObj = await app.getMeasure(measure.qInfo.qId);
                        let layout = await msrObj.getLayout();
                        let version = await db.getMaxVersionForItem(appid, measure.qInfo.qId);
                        let returnObject = {
                            id:     layout.qInfo.qId,
                            label:  layout.qMeasure.qLabel,
                            def:    layout.qMeasure.qDef,
                            title:  layout.qMeta.title,
                            desc:   layout.qMeta.description,
                            layout: layout,
                            version: version
                        };                                  
                        return returnObject;
                    }
                    return getDetails();
                })
            );
        }

        //Get Dimesnions
        let getDimensionDetails = async function () {
            let obj = await app.createSessionObject(myCubes.dims);
            let layout = await obj.getLayout();
            
            return await Promise.all(
                layout.qDimensionList.qItems.map((dimension) => {
                    let getDetails = async function () {
                        let dimObj = await app.getDimension(dimension.qInfo.qId);
                        let layout = await dimObj.getLayout();
                        let version = await db.getMaxVersionForItem(appid, dimension.qInfo.qId);
                        let returnObject = {
                            id:     layout.qInfo.qId,
                            label:  layout.qDim.qFieldLabels[0],
                            def:    layout.qDim.qFieldDefs[0],
                            title:  layout.qMeta.title,
                            desc:   layout.qMeta.description,
                            layout: layout,
                            version: version
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
        console.error('qsPammi:',error)
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

export async function qsDeployMasterItem(appid, object) {
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

    var result;

    

    if(object.qInfo.qType=="measure") {
        let options = {
            qInfo: object.qInfo,
            qMeasure: object.qMeasure,
            qMetaDef: {
                title: object.qMeta.title,
                description: object.qMeta.description,
                tags: object.qMeta.tags
            }
        }
        result = await app.createMeasure(options);
    } else if(object.qInfo.qType=="dimension") {
        let options = {
            qInfo: object.qInfo,
            qDim: object.qDim,
            qMetaDef: {
                title: object.qMeta.title,
                description: object.qMeta.description,
                tags: object.qMeta.tags
            }
        }
        result = await app.createDimension(options);
    }

    await app.doSave();
    await app.session.close();
    return result;
}