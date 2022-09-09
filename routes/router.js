require('dotenv').config();
const express = require('express');
const router = express.Router();
const { showIndex, updateContract, showNotifs, showLogin, showForgot, postLogin, showAddUser, postAddUser, showUserList, showEditUser, postEditUser, deleteUser, checkAuth, checkAuth2, logout } = require('../controllers/contract');

// Navigation 
router.route('/').get(checkAuth, showIndex);
router.route('/client/:id').get(checkAuth, showIndex);
router.route('/update/:id').post(updateContract);
router.route('/notification').get(checkAuth, showNotifs);
router.route('/login').get(checkAuth2, showLogin).post(postLogin);
router.route('/forgot-password').get(checkAuth2, showForgot);
router.route('/add-user').get(checkAuth, showAddUser).post(postAddUser);
router.route('/user-list').get(checkAuth, showUserList).post(deleteUser);
router.route('/edit-user/:id').get(checkAuth, showEditUser).post(postEditUser);
router.route('/logout').get(logout);

module.exports = router;