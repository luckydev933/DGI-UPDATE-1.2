const Controller = require('express').Router()
const SQL = require('mssql')
const DBO = require('../../modules/database')
const sha256 = require('js-sha256')
const Auth = require('../../modules/Authorization')

Controller.post('/api', async function(request, response){
    try {
        const api_key    = request.body.api_key
        const secret_key = request.body.secret_key
        const unix       = request.body.unix
        const api_token  = request.body.token

        Auth.AccessControl(api_key, secret_key, unix, api_token)

        console.log(api_key)
        response.status(200).json({
            data: Auth
        })
    } catch (error) {
        response.status(400).json({
            message: 'Error Request '+error
        })
    }
})

Controller.get('/', async function(request, response){
    try {
        response.render('testView')
    } catch (error) {
        response.status(400).json({
            message: 'Error Load View '+error
        })        
    }
})

module.exports = Controller