const bcrypt = require('bcrypt');
const models = require('../../models');

//regex
const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regMdp = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;




module.exports = {
    
    register: function (req, res) {
        const email = req.body.email;
        const username = req.body.username;
        const mdp = req.body.mdp;
        const BIO = req.body.BIO

        if (email == null || username == null || mdp == null) {
            return res.status(400).json({ 'error': 'missing params' })
        }
        // validation des données :

        // Email valide : (emailregex.com)
        if (!regEmail.test(email)) {
            return res.status(400).json({ 'error': 'Veuillez renseigner un email valide' })
        }

        // Username length : (min = joe)(max = grandMaster666) 
        if (username <= 3 || username >= 15) {
            return res.status(400).json({ 'error': 'Votre pseudo doit avoir entre 3 et 15 caractéres' })
        }
        // mdp complexité : [min 8 caractéres / min : 1 miniscule / min : 1 majuscule / min : 1 number / min : 1 caractére spé (!@#$%^&*)]
        /*if (!regMdp.test(mdp)){
            return res.status(400).json({ 'error': 'password non valide [min 8 caractéres / min : 1 miniscule / min : 1 majuscule / min : 1 number / min : 1 caractére spé (!@#$%^&*)]' })
        }*/
        // bio 5 NON OBLIGATOIRE mais si remplis Min(30)-max(220)
        if (BIO <= 30 ) {
            return res.status(400).json({ 'error': 'Vueillez vous decrire avec un text de minimum 30 caractére et maximum 220' })
        }

        // import DB 
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
            .then(function (noDoubleEmail) {
                if (!noDoubleEmail) {
                    models.User.findOne({
                        attributes: ['username'],
                        where: { username: username }
                    })
                        .then(function (noDoubleUsername) {
                            if (!noDoubleUsername) {
                                bcrypt.hash(mdp, 10, function (err, hashMdp) {
                                    const newUser = models.User.create({
                                        email: email,
                                        username: username,
                                        mdp: hashMdp,
                                        BIO: BIO,
                                        isAdmin: 0
                                    }).then(function (User) {
                                        return res.status(201).json({ User })
                                    }).catch(function (err) {
                                        return res.status(500).json({ 'error': 'code error' })
                                    })
                                })
                            } else {
                                return res.status(401).json({ 'error': 'username existant' })
                            }
                        }).catch(function (err) {
                            return res.status(500).json({ 'error': 'code error 1' })
                        })
                } else {
                    return res.status(401).json({ 'error': 'utilisateur existant' })
                }
            }).catch(function (err) {
                return res.status(500).json({ 'error': 'code error 1' })
            })
    },
};




