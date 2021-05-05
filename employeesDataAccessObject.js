const mysql = require('mysql');
const inquirer = require('inquirer');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'docker',
  database: 'greatBay_DB',
});

// function which prompts the user for what action they should take
const start = () => {
  inquirer
    .prompt({
      name: 'postOrBid',
      type: 'list',
      message: 'Would you like to [POST] an auction or [BID] on an auction?',
      choices: ['POST', 'BID', 'EXIT'],
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions

      switch (answer.postOrBid) {
        case "POST":
          postAuction();
          break;
        case "BID":
          bidAuction()
          break;
        default:
          connection.end()
          break;
      }
    });
};

// function to handle posting new items up for auction
const postAuction = () => {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: 'item',
        type: 'input',
        message: 'What is the item you would like to submit?',
      },
      {
        name: 'category',
        type: 'input',
        message: 'What category would you like to place your auction in?',
      },
      {
        name: 'startingBid',
        type: 'input',
        message: 'What would you like your starting bid to be?',
        validate(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        'INSERT INTO auctions SET ?',
        // QUESTION: What does the || 0 do?
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0,
        },
        (err) => {
          if (err) throw err;
          console.log('Your auction was created successfully!');
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
};

const bidAuction = () => {
  // query the database for all items being auctioned
  connection.query('SELECT * FROM auctions', (err, results) => {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          name: 'choice',
          type: 'rawlist',
          choices() {
            const choiceArray = [];
            results.forEach(({ item_name }) => {
              choiceArray.push(item_name);
            });
            return choiceArray;
          },
          message: 'What auction would you like to place a bid in?',
        },
        {
          name: 'bid',
          type: 'input',
          message: 'How much would you like to bid?',
        },
      ])
      .then((answer) => {
        // get the information of the chosen item
        let chosenItem;
        results.forEach((item) => {
          if (item.item_name === answer.choice) {
            chosenItem = item;
          }
        });

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          let sql = 'UPDATE auctions SET highest_bid=? WHERE id = ?;'
          // bid was high enough, so update db, let the user know, and start over
          // UPDATE auctions SET starting_bid=299, highest_bid=299 WHERE id = 4;
          connection.query(sql, [answer.bid, chosenItem.id], (err) => {
            if (err) throw err;
            console.log(`Bid placed successfully (${chosenItem.id})!!`)
            start();
          })

        } else {
          // bid wasn't high enough, so apologize and start over
          console.log('Your bid was too low. Try again...');
          start();
        }
      });
  });
};


// connect to the mysql server and sql database
connection.connect(err => {
  if (err) throw err;
  start()
})