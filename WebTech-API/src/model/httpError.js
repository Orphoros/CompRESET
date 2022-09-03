class HttpError {
    /**
     * Creating a new HttpError will result in an immediate HTTP error response
     * @param {*} req 
     * @param {*} res 
     * @param {Int32Array} code HTTP status code
     * @param {String} message Error message of cause
     */
    constructor(req, res, code, message){
        let jsonBody =
            {
                'response':'Error',
                'code':code,
                'cause':message,
                'path':`${req.baseUrl}`,
                'request':
                    {
                        'type': req.method,
                        'headers': req.headers,
                        'queries':req.query,
                        'body':req.body,
                        'pathParam':req.params,
                    }
            };
        res.status(code).send(jsonBody);
    }
}
module.exports = HttpError;