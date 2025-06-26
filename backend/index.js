const express = require('express');
const mongoose=require('mongoose');

const app=express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
require('dotenv').config();

const PORT = 4000;
const MONGO_URI = "mongodb+srv://janani:jan54@cluster0.zzmrosz.mongodb.net/expense?retryWrites=true&w=majority&appName=Cluster0";


const expenseSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

const Expense = mongoose.model('Expense',expenseSchema);

mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDb");
})
.catch((err)=>{
    console.log("Error connecting to MongoDb",err);
})

app.post('/Expense',async(req,res)=>{
    try{
        const{title,amount}=req.body;
        const expense=new Expense({title,amount});
        await expense.save();
        res.status(201).json(expense)
    }catch(error){

        console.error('Error saving expense',error)
        res.status(500).json({error: "failed to save"})
    }
    })

    app.get('/Expense',async(req,res)=>{
        try{
            const expenses=await Expense.find();
            res.json(expenses)
        }
        catch(error){
           console.error('Error getting expense',error)
        res.status(500).json({error: "failed to load"})
        }
    })



    app.delete('/Expense/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        const deleteExpense= await Expense.findByIdAndDelete(userID);
        if (!deleteExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.status(201).json('Expense deleted successfully');
    } catch (error) {
        console.error('Error deleting expense', error);
        res.status(500).json({ error: "failed to delete" });
    }
});



app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);

})