const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const express = require('express');
const router = express.Router();

let sitemap;

router.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    // Eğer önceden oluşturulmuş bir sitemap varsa, bunu kullanın
    if (sitemap) {
        res.send(sitemap);
        return;
    }

    try {
        const smStream = new SitemapStream({ hostname: 'http://example.com/' });
        const pipeline = smStream.pipe(createGzip());

        // Rotalarınızı ekleyin
        smStream.write({ url: '/', changefreq: 'daily', priority: 0.9 });
        smStream.write({ url: '/#about', changefreq: 'weekly', priority: 0.8 });
        smStream.write({ url: '/#rooms', changefreq: 'weekly', priority: 0.8 });
        smStream.write({ url: '/#gallery', changefreq: 'weekly', priority: 0.8 });
        smStream.write({ url: '/#contact', changefreq: 'monthly', priority: 0.7 });
        smStream.write({ url: '/#services', changefreq: 'weekly', priority: 0.8 });
        smStream.write({ url: '/admin', changefreq: 'monthly', priority: 0.7 });
        smStream.write({ url: '/admin/upload', changefreq: 'monthly', priority: 0.6 });
        smStream.write({ url: '/admin/delete-images', changefreq: 'monthly', priority: 0.6 });
        smStream.write({ url: '/admin/logout', changefreq: 'monthly', priority: 0.6 });
        smStream.write({ url: '/admin/register', changefreq: 'monthly', priority: 0.5 });

        // Diğer rotalarınızı burada ekleyin

        smStream.end();

        // Sitemap'i cache'leyin
        streamToPromise(pipeline).then(sm => sitemap = sm);
        
        // Sitemap'i response olarak gönderin
        pipeline.pipe(res).on('error', (e) => { throw e; });
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

module.exports = router;
