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

export function qsPullMasterItems (appid) {

    const session = enigma.create({
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

    return new Promise((resolve, reject) => {
        session.open()
        .then((global) => {
            return global.openDoc(appid)
        }).then((app) => {

            //Get Measures
            var p1 = new Promise((resolve, reject) => {
                app.createSessionObject(myCubes.msre).then((obj) => {
    
                    obj.getLayout().then( (layout) => {                        
                        resolve(layout.qMeasureList.qItems);
                    }).catch(err => console.log('Rejection: ', err))
    
                }).catch(err => console.log('Rejection: ', err));
    
            }).catch(err => console.log('Rejection: ', err));
    
            //Get Dimesnions
            var p2 = new Promise( (resolve, reject) => {
                app.createSessionObject(myCubes.dims).then((obj) => {
    
                    obj.getLayout().then( (layout) => {
                        resolve(layout.qDimensionList.qItems);    
                    }).catch(err => console.log('Rejection: ', err));
    
                }).catch(err => console.log('Rejection: ', err));
    
            }).catch(err => console.log('Rejection: ', err));
            
            //Pass through app object
            var p3 = Promise.resolve(app);
    
            return Promise.all([p1, p2, p3])
        
        }).then((r) => {
            r[2].session.close(); //Close App
            return [r[0], r[1]];                              
        }).then((results) => {
            session.close();
            resolve(results);
        })
        .catch(err => console.log('Rejection: ', err))
    })
};

export function qsPullAndMapMasterItems (appid) {

    const session = enigma.create({
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

    return new Promise((resolve, reject) => {
        session.open()
        .then((global) => {
            return global.openDoc(appid)
        }).then((app) => {

            //Get Measures
            var p1 = new Promise((resolve, reject) => {
                app.createSessionObject(myCubes.msre).then((obj) => {
    
                    obj.getLayout().then( (layout) => {
                        let msrDetail = layout.qMeasureList.qItems.map((measure) => {
                            return new Promise((resolve, reject) => {
                                app.getMeasure(measure.qInfo.qId)
                                .then((msrObj) => {
                                    return msrObj.getLayout()
                                    .then((layout) => {
                                        let returnObject = {
                                            id:     layout.qInfo.qId,
                                            label:  layout.qMeasure.qLabel,
                                            def:    layout.qMeasure.qDef,
                                            title:  layout.qMeta.title,
                                            desc:   layout.qMeta.description,
                                            layout: layout
                                        };                                  
                                        resolve(returnObject);
                                    })
                                })
                            }).catch(err => console.log('Rejection: ', err))
                        })
                        Promise.all(msrDetail).then((rArr) => {
                            resolve(rArr);
                        })
                    }).catch(err => console.log('Rejection: ', err))
    
                }).catch(err => console.log('Rejection: ', err));
    
            }).catch(err => console.log('Rejection: ', err));
    
            //Get Dimesnions
            var p2 = new Promise( (resolve, reject) => {
                app.createSessionObject(myCubes.dims).then((obj) => {
    
                    obj.getLayout().then( (layout) => {
                        let dimDetail = layout.qDimensionList.qItems.map((dimension) => {
                            return new Promise((resolve, reject) => {
                                app.getDimension(dimension.qInfo.qId)
                                .then((dimObj) => {
                                    return dimObj.getLayout()
                                    .then((layout) => {
                                        let returnObject = {
                                            id:     layout.qInfo.qId,
                                            label:  layout.qDim.qFieldLabels[0],
                                            def:    layout.qDim.qFieldDefs[0],
                                            title:  layout.qMeta.title,
                                            desc:   layout.qMeta.description,
                                            layout: layout
                                        };                                  
                                        resolve(returnObject);
                                    })
                                }).catch(err => console.log('Rejection: ', err))
                            }).catch(err => console.log('Rejection: ', err))
                        });
                        Promise.all(dimDetail).then((dimArr) => {
                            resolve(dimArr);
                        }).catch(err => console.log('Rejection: ', err))                    
                    }).catch(err => console.log('Rejection: ', err));
    
                }).catch(err => console.log('Rejection: ', err));
    
            }).catch(err => console.log('Rejection: ', err));
            
            //Pass through app object
            var p3 = Promise.resolve(app);
    
            return Promise.all([p1, p2, p3])
        
        }).then((r) => {
            r[2].session.close(); //Close App
            return [r[0], r[1]];                              
        }).then((results) => {
            session.close();
            resolve(results);
        })
        .catch(err => console.log('Rejection: ', err))
    })
};

export function qsGetDocList() {
    const session = enigma.create({
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

    return new Promise((resolve, reject) => {
        session.open()
        .then((global) => {
            global.getDocList().then((list) => {
                resolve(list);
                session.close();
            })
        })
    })
}