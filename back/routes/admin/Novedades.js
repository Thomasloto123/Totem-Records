var express = require('express');
var router = express.Router();
var NovedadesModel = require('../../models/NovedadesModel');

/* GET home page. */
router.get('/', async function (req, res, next) {

    var novedades = await NovedadesModel.getNovedades();

    res.render('admin/Novedades', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        novedades
    });
});

router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    });
});

router.post('/agregar', async (req, res, next) => {
    try {
        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
            await NovedadesModel.insertNovedades(req.body);
            res.redirect('/admin/novedades')
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'todos los campos son requeridos'

            })
        }
    } catch (error) {
        console.log(error)
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se creo la novedad'


        })

    }
})

router.get('/eliminar/:id', async (req, res, next) =>{
    var id = req.params.id;
    await NovedadesModel.borrarNovedades(id);
    res.redirect('/admin/novedades');
})

router.get('/modficar/:id', async (req, res, next) =>{
    var id = req.params.id;
    var novedad = await NovedadesModel.getNovedadesId(id);
    res.render('admin/modificar', {
        layout: 'admin/layout',
        novedad
    })
});

router.post('/modificar', async (req, res, next) =>{
    try{

        var obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            cuerpo: req.body.cuerpo
        }
        console.log(obj)

        await NovedadesModel.modificarNovedadId(obj, req.body.id);
        res.redirect('admin/modificar');
    } catch (error){
        console.log(error)
        res.render('admin/modificar',{
            layout: 'admin/layou',  
            error: true,
            message: 'No se modifico la novedad'
        })
    }
    
})



module.exports = router;