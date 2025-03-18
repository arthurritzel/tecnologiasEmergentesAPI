import { Router } from 'express';
import { createUser, listUsers, updateUser, deleteUser, showUser } from '../controllers/userController.js';

import validator from '../middleware/validator.js';
import userValidation from './userValidation.js';

const router = Router()

router.get('/', listUsers)

router.get('/:id', showUser)

router.post('/', validator(userValidation), createUser)

router.put('/:id', validator(userValidation), updateUser)

router.delete('/:id', deleteUser)

export default router;