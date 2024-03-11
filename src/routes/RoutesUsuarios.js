import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';

const router = express.Router();

/* Crear Usuarios. */
router.post('/registrar', function (req, res, next) {
    UsuarioController.registrar(req, res)
        .then((resultado) => {
            res.render("registrar", {
                status: 200,
                usuario: resultado.usuario
            })
        })
        .catch((error) => {
            res.render("registrar", {
                status: 400,
                error: error
            })
        })
});

// Hacer Login
router.post('/login', function (req, res, next) {
    UsuarioController.login(req, res)
        .then((resultado) => {
            res.render("login", {
                status: 200,
                token: resultado.token
            })
        })
        .catch((error) => {
            res.render("login", {
                status: 400,
                error: error
            })
        })
});

router.get('/login', function (req, res, next) {
    res.render("login", {
        status: 0
    })
});

router.get('/registrar', function (req, res, next) {
    res.render("registrar", {
        status: 0
    })
});

export default router;