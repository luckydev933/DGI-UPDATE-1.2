const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const Logger = require('morgan')
const axios = require('axios')
const fs = require('fs')
const SQL = require('mssql')
const sha256 = require('js-sha256')
const responseTime = require('response-time')
require('dotenv').config()
const API_URL = '/dgi_api/v1'
const PRSPController  = require('./api/controllers/H1/PRSPController')
const SPKController   = require('./api/controllers/H1/SPKController')
const PINBController  = require('./api/controllers/H23/PINBController')
const LSNGController  = require('./api/controllers/H1/LSNGController')
const PRSLController  = require('./api/controllers/H23/PRSLController')
const DOCHController  = require('./api/controllers/H1/DOCHController')
const BASTController  = require('./api/controllers/H1/BASTController')
const UINBController  = require('./api/controllers/H1/UINBController')
const INV1Controller  = require('./api/controllers/H1/INV1Controller')
const DPHLOController = require('./api/controllers/H23/DPHLOController')
const PKBController   = require('./api/controllers/H23/PKBController')
const testController = require('./api/controllers/testController')
const INV2Controller = require('./api/controllers/H23/INV2Controller')
const App = express()


App.use(bodyParser.json())
App.use(cors())
App.use(express.static(path.join(__dirname, '/public')))
const AccessLogStream = fs.createWriteStream(path.join(__dirname, '/log/Activity.log.json'), {flags: 'a'})

Logger.token('json', function(request, response){
    return response.getHeader('X-Response-Count')
})
Logger.token('request-time', function(request, response){
    return new Date().toUTCString()
})

Logger.token('statuscode', function(request, response){
    return response.statusCode
})

Logger.token('ip', function(request, response){
    return request.ip
})

Logger.token('body', function(request, response){
    return request.body
})

Logger.token('dealer', function(request, response){
    return response.getHeader('X-Response-Dealer')
})


Logger.token('status', function(request, response){
    if(response.statusCode == 200){
        return 1
    }else if(response.statusCode == 400){
        return 0
    }else if(response.statusCode == 404){
        return 0
    }else{
        return 0
    }
})

function ReadLog (path){
    fs.readFile(path, 'utf8', (err, json) => {
        if(err){
            console.log(err)
        }

    const data = JSON.parse(json)
    console.log(data)
    })
}

// ReadLog(path.join(__dirname, '/log/Activity.log.json'))
var BodyObj = 
App.use(Logger(
    JSON.stringify({
    "DealerRequestActivity" : ":dealer",  
    "IP": ":ip",
    "Endpoint" : ":url",  
    "BodyRequest" : `[{:body}]`,
    "StatusCode": ":statuscode",
    "RequestTime": ":request-time",
    "ResponseTime": ":response-time",
    "Message": ":json",
    "ResponseStatus": ":status"
    }, null, 2),{stream: AccessLogStream}))

App.use(responseTime())
App.set('view engine', 'ejs')
App.set('views', path.join(__dirname, '/api/views'))

App.get('/request', function(request, response){
    response.render('requestApi', {
        title: 'Request API Test'
    })
})


function FormatDate(dateString){
    const v = dateString.split("-")
    const tahun = ''+v[0]+''+v[1]+''+v[2]+''+v[3]+''
    const bulan = ''+v[4]+''+v[5]+''
    const tgl   = ''+v[6]+''+v[7]+''
    return ''+tahun+''+bulan+''+tgl+''
}

App.post('/request/:modul', function(request, response){

    const api_key    = request.body.api_key
    const secret_key = request.body.secret_key
    const unix       = Math.floor(new Date() / 1000)
    const hash       = sha256.create()
    hash.update(api_key+''+secret_key+''+unix)
    const token = hash.hex()

    const Headers = {
        'X-Request-Time' : unix,
        'DGI-API-Key': api_key,
        'DGI-API-Token': token
    }

    

    // const data = {
    //     fromTime: FormatDate(request.body.FromTime),
    //     toTime: FormatDate(request.body.toTime),
    //     idProspect: request.body.idProspect
    // }

    const modul = request.params.modul
    const Time = FormatDate(''+request.body.fromTime+'')
    console.log(request.body)
    console.log(Time)
    response.status(200).json({
        Time
    })
    // axios.post('/dgi/api/v1/'+modul+'/read', data, {
    //     headers: Headers
    // })
})
App.use('/dgi_api/v1/dphlo/add/', DPHLOController)
App.use('/dgi_api/v1/inv1/', INV1Controller)
App.use('/dgi_api/v1/inv2/add/', INV2Controller)
App.use('/dgi_api/v1/pkb/read/', PKBController)
App.use('/dgi_api/v1/bast/read/', BASTController)
App.use('/dgi_api/v1/doch/read/', DOCHController)
App.use('/dgi_api/v1/prsl/read/', PRSLController)
App.use('/dgi_api/v1/prsp/read/', PRSPController)
App.use('/dgi_api/v1/spk/read/', SPKController)
App.use('/dgi_api/v1/pinb/read/', PINBController)
App.use('/dgi_api/v1/lsng/read/', LSNGController)
App.use('/dgi_api/v1/uinb/read/', UINBController)

const PORT = process.env.PORT || 3000

App.listen(PORT, function(){
    console.log('server has been started on port '+PORT)
})