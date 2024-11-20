var express = require('express');
var router = express.Router();
var NovedadesModel = require('../../models/NovedadesModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);


/* GET home page. */
router.get('/', async function (req, res, next) {

    var novedades = await NovedadesModel.getNovedades();

    novedades = novedades.map(novedad =>{
        if (novedad.img_id){
            const imagen = cloudinary.image(novedad.img_id, {
                width: 100,
                height: 100,
                crop: 'fill'
            });
            return{
                ...novedad,
                imagen
            }
        } else{
            return{
                ...novedad,
                imagen: ''
            }
        }
    });

    res.render('admin/novedades', {
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
            var img_id = '';
            if (req.files && Object.keys(req.files).length > 0) {
                imagen = req.files.imagen;
                img_id = (await uploader(imagen.tempFilePatch)).public_id;
            }
        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
            await NovedadesModel.insertNovedades({
                ...req.body,
                img_id
            });
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