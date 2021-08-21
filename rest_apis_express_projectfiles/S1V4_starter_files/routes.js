const express = require('express');
const router = express.Router();
const records = require('./records');

function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        next(err);
      }
    }
  }

  //send a GET req to /quotes to READ a list of quote 
router.get('/quotes', async (req, res)=>{
    try {
      const quotes = await records.getQuotes();
      res.json(quotes);
    } catch(err){
        res.json({message: err.message});
    }
    
});
//send a GET req to /quotes/:id to READ(view) a quote
router.get('/quotes/:id', async (req, res)=>{
    try{
      const quote = await records.getQuote(req.params.id);
      if(quote){
        res.json(quote);
        } else {
            res.status(404).json({message: "Quote not found."});
        }
    } catch(err){
        res.status(500).json({message: err.message});
    }

});
//send a GET request to /quotes/quote/random to READ (view) a random quote
router.get('/quotes/quote/random', asyncHandler(async (req, res, next)=>{no
      const quote = await records.getRandomQuote();
      res.json(quote);
}));

//send a POST req to /quotes to CREATE a new quote
router.post('/quotes', asyncHandler( async(req, res)=>{
    if(req.body.author && req.body.quote){
        const quote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        });
        res.status(201).json(quote);    
    } else {
        res.status(400).json({message: "Quote and authur required."});
    }
}));

//send a PUT req to /quotes/:id to UPDATA(edit) a quote
router.put('/quotes/:id', asyncHandler(async(req, res) =>{
    
    const quote = await records.getQuote(req.params.id);
    if (quote){
            quote.quote = req.body.quote;
            quote.author = req.body.author;
            
            await records.updateQuote(quote);
            res.status(204).end();
    } else {
        res.status(404).json({message:"Quote Not Found"});
    }    
}));
//send a DELETE req to /quotes/:id to DELETE a quote
router.delete("/quotes/:id", async(req, res, next)=>{
    try{
        throw new Error("Something terrible happened!");
        const quote = await records.getQuote(req.params.id);
        await records.deleteQuote(quote);
        res.status(204).end();
    } catch(err) {
        next(err);
    }
});



module.exports = router;