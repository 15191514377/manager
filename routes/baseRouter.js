const router = require('express').Router()

router.use('/',(req, res, next) => {
    if (req.url === '/api/user/login') {
        return next()
    }
    console.log('req.headers',req.headers);
    const token = req.headers['authorization']?.split[' '][1]
    console.log(req.url,{token});

    if (token) {
        const payload = JWT.verify(token)
        if (payload) {
            const newToken = JWT.generate({
                userId: payload.userId,
                password: payload.password,
            }, '0.5h')
            res.header('Authorization', newToken)
            next()
        } else {
            res.status(401).send({
                err: "-1",
                errInfo: "token过期"
            })
        }
    }
})

module.exports = router