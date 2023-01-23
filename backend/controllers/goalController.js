const asyncHandler = require('express-async-handler')

const Goal = require ('../models/goalModel')
const User = require ('../models/userModel')

//description Get goals
//route GET /api/goals
//access Privete
const getGoals =asyncHandler( async(req, res) =>{
    const goals = await Goal.find({user: req.user.id})

    res.status(200).json(goals)
})

//description Set goal
//route POST /api/goals
//access privete
const setGoal = asyncHandler(async (req, res) =>{
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text fields')
    }

    const goal = await Goal.create({
        text: req.body.text,
        user:req.user.id,
    })
    res.status(200).json(goal);
})
//des update goals
//route PUT /api/goals/:id
//access privete
const updateGoal =asyncHandler( async (req, res) =>{
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }



    //check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
    })

    res.status(200).json(updatedGoal);
})
// Delete goals
//route DELETE /api/goals/:id
//access privete
const deleteGoal = asyncHandler(async (req, res) =>{
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }
   

    //check for user
    if(!req.user){
        res.status(401)
        throw new Error('User not found')
    }

    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('User not authorized')
    }
     await goal.remove()
    res.status(200).json({id:req.params.id});
}
)
module.exports ={
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal,
}