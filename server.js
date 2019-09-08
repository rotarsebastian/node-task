const helpers = require(__dirname + '/helpers.js');
const loadedData = require(__dirname + '/data.json');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const port = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
    extended: true
}));


// ADD NEW USER FUNCTIONALITY
app.post('/user', function (req, res, next) {
    //CHECK IF THE USERS ARE CREATED IN THE DATABASE
    if (!loadedData.users) {
        helpers.sendErrorMessage(res, 'users can not be found');
        return;
    }

    //GET THE USER ID 
    const {
        name
    } = req.body;

    //CHECK IF USER NAME IS PASSED 
    if (!name) {
        helpers.sendErrorMessage(res, 'user name must be added');
        return;
    }

    //CREATE THE NEW USER
    const newUser = {};
    newUser.id = uuidv4();
    newUser.name = name;

    //ACCES THE USERS 
    const {
        users
    } = loadedData;

    //ADD THE NEW USER 
    users.push(newUser);

    //WRITE BACK TO THE FILE
    fs.writeFile('./data.json', JSON.stringify(loadedData), function (err) {
        if (err) throw err;
        helpers.sendSuccessMessage(res, 'user successfully added', 'user', JSON.stringify(newUser));
    });
});

//GET ALL THE USERS FUNCTIONALITY
app.get('/', (req, res) => {
    loadedData.users ? helpers.sendSuccessMessage(res, 'users successfully fetched', 'users', JSON.stringify(loadedData.users)) : helpers.sendErrorMessage(res, 'users can not be found');
});

//GET A SPECIFIC USER FUNCTIONALITY
app.get('/user', (req, res) => {

    //GET THE USER ID
    const {
        id
    } = req.query;

    //CHECK IF USER ID IS PASSED 
    if (!id) {
        helpers.sendErrorMessage(res, 'user ID is not passed');
        return;
    }

    //CHECK IF THE USERS ARE CREATED IN THE DATABASE
    if (!loadedData.users) {
        helpers.sendErrorMessage(res, 'users can not be found');
        return;
    }

    //SET THE USER AS NOT FOUND AT THE BEGINNING
    let userFound = false;

    //ACCESS THE USERS
    const {
        users
    } = loadedData;

    //CHECK THROUGH THE USERS
    users.forEach(user => {
        //IF THE USER IS FOUND SEND THE RESPONSE BACK AND SET userFound TO TRUE
        if (user.id === id) {
            userFound = true;
            helpers.sendSuccessMessage(res, 'user successfully fetched', 'user', JSON.stringify(user));
            return;
        }
    });

    //IF USER IS NOT FOUND SEND RESPONSE THAT THE ID IS INVALID
    if (!userFound) {
        helpers.sendErrorMessage(res, 'user ID is invalid');
    }
});

//DELETE A SPECIFIC USER FUNCTIONALITY
app.delete('/user', (req, res) => {

    //GET THE USER ID 
    const {
        id
    } = req.query;


    //CHECK IF USER ID IS PASSED 
    if (!id) {
        helpers.sendErrorMessage(res, 'user ID is not passed');
        return;
    }

    //CHECK IF THE USERS ARE CREATED IN THE DATABASE
    if (!loadedData.users) {
        helpers.sendErrorMessage(res, 'users can not be found');
        return;
    }

    //SET THE USER AS NOT DELETED AT THE BEGINNING
    let userDeleted = false;

    //ACCESS THE USERS
    const {
        users
    } = loadedData;

    //CHECK THROUGH THE USERS
    users.forEach(user => {
        //IF THE USER IS FOUND DELETE IT, SET userDeleted TO TRUE, SAVE THE NEW USERS TO THE FILE AND SEND THE RESPONSE BACK
        if (user.id === id) {
            const userIndex = users.indexOf(user);
            users.splice(userIndex, 1);
            userDeleted = true;
            fs.writeFile('./data.json', JSON.stringify(loadedData), function (err) {
                if (err) throw err;
                helpers.sendSuccessMessage(res, 'user successfully deleted', 'user', JSON.stringify(user));
            });
            return;
        }
    });

    //IF USER IS NOT DELETED SEND RESPONSE THAT THE ID IS INVALID
    if (!userDeleted) {
        helpers.sendErrorMessage(res, 'user ID is invalid');
    }
});

app.listen(port, () => {
    console.log(`SERVER LISTENING ON ${port}`);
});