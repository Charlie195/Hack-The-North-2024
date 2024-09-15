require("dotenv").config();

const cors = require("cors");
const express = require("express");

const { connectToDb, getDb } = require('./db');

const app = express();

const PORT = 5001 || process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("", (req, res) => {
    db.collection('users').findOne()
        .then((result) => {
            console.log("yo")
            console.log(result);
        
            res.send("Here's an element from the comments collection: " + result.name);
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
});

// app.get("/getCart", (req, res) => {
//     const email = req.body.email;

//     db.collection('carts').findOne(
//         { cart_contributors: email }
//     ).then((cart) => {
//         const cartContributors = cart.cart_contributors;

//         let cartData = [];
        
//         Promise.all(cartContributors.map(contributor => {
//             return db.collection('users').findOne({ email: contributor })
//                 .then(user => {
//                     let userData = {
//                         name: user.name,
//                         basket: user.basket
//                     };
//                     console.log(userData);
//                     return userData; // Return userData to be used in Promise.all
//                 }).catch(err => {
//                     console.log(err);
//                     return err; // Handle error, but consider how you want to proceed in case of error
//                 });
//         })).then(results => {
//             // // All promises have resolved, results is an array of userData
//             // cartData.push(...results); // Spread operator to push each userData into cartData
//             // cartData.push({
//             //     sharedBasket: cart.shared_basket
//             // });
//             res.send(cartData);
//         }).catch(err => {
//             // Handle any error that occurred during the execution of any promise
//             console.log(err);
//             res.status(500).send(err);
//         });
//     })
//     .catch((err) => {
//         console.log(err);
//         return err;
//     });
// })

app.get("/getCart", (req, res) => {
    const email = req.body.email;

    db.collection('users').findOne({ email: email })
        .then(user => {
            res.send(user.basket); // Return userData to be used in Promise.all
        }).catch(err => {
            console.log(err);
            return err; // Handle error, but consider how you want to proceed in case of error
        });
})

app.post("/addToCart", (req, res) => {
    const email = req.body.email;
    const itemData = req.body.itemData;

    console.log(itemData)

    db.collection('users').updateOne(
        { email: email },
        { $push: { basket: itemData}},
        (err, result) => {
            if (err) {
                console.error("Error updating user:", err);
            } else if (result.matchedCount === 0) {
                console.log("No user found with the specified email.");
            } else {
                console.log("User updated successfully.");
            }
          }
    )
    .then(() => {
        res.send("Item added to individual basket successfully.");
    })
    .catch((err) => {
        console.log(err);
        return err;
    })
})


// app.post("/addToSharedBasket", (req, res) => {
//     const email = req.body.email;
//     const itemData = req.body.itemData;

//     db.collection('carts').updateOne(
//         { cart_contributors: email },
//         { $push: { shared_basket: itemData}},
//         (err, result) => {
//             if (err) {
//                 console.error("Error updating user:", err);
//             } else if (result.matchedCount === 0) {
//                 console.log("No user found with the specified email.");
//             } else {
//                 console.log("User updated successfully.");
//             }
//           }
//     )
//     .then(() => {
//         res.send("Item added to individual basket successfully.");
//     })
//     .catch((err) => {
//         console.log(err);
//         return err;
//     })
// })


connectToDb((err) => {
    if (!err) {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })

        db = getDb();
    }
});