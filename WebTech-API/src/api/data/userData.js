const User = require('../../model/user');
const {v4:uuidv4} = require('uuid');

const users = [
    new User('test1@email.test','a', '$2a$10$.y6aUOAROG0iZlWOBO7HBuvLknJu6073kM1wC0buEEZNrDw35xgTm',uuidv4(),false), // pw: Test1PW!
    new User('test2@email.test','b', '$2a$10$FzqDKuVZzcRGLuvMaS8gyeaukLq2kqsFPguG2rv//WSgg1uB8hFWu',uuidv4(),false), // pw: Test2PW!
    new User('test3@email.test','c', '$2a$10$y39I1IVn3y.9sUW2hPVLoutLHT4UdJ7sRpD3CDlzU9pvubrN31CWG',uuidv4(),false), // pw: Test3PW!
    new User('admin@development.test','admin', '$2a$10$WvLiEZcqvgJjpZT9HI0nlOmZIArSMZRDnDuqwCMj1GPaG25PXByJK',uuidv4(),true), // pw: Test4AdminPW!
];

const invalidTokens = [];

module.exports = {users,invalidTokens};