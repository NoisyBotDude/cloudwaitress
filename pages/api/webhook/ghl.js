const ghlWebhook = async (req, res) => {
    
    if (req.method === 'POST') {
        console.log('req.body: ', req.body);
    }

    res.status(200).send('ok');
}

export default ghlWebhook;