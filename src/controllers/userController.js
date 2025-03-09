import httpStatus from 'http-status';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const listUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res
            .status(httpStatus.OK)
            .json({
                length: users.length,
                users: users
            })
    } catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
                message: "Erro ao listar os usuarios",
                error: error
            })
    }
}

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const user = await User.create({ name, email, password: hashedPassword });
        res
            .status(httpStatus.CREATED)
            .json({
                user: {
                    name: user.name,
                    email: user.email,
                }
            })
    } catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
                message: "Erro ao criar o usuario",
                error: error
            })
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const { password, ...updateData } = req.body; // Separar senha dos outros dados

        const find = await User.findById(userId);
        if (!find) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Usuário não encontrado" });
        }
        
        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        res
            .status(httpStatus.OK)
            .json({
                user: {
                    name: user.name,
                    email: user.email,
                }
            })
    }
    catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
                message: "Erro ao atualizar o usuario",
                error: error
            })
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const find = await User.findById(userId)

        if (!find) {
            res
                .status(httpStatus.NOT_FOUND)
                .json({
                    message: "Usuario nao encontrado"
                })
            return 
        }

        const user = await User.findByIdAndDelete(userId)
        res
            .status(httpStatus.OK)
            .json({
                message: "Usuario deletado com sucesso"
            })
    }
    catch (error) {
        res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({
                message: "Erro ao deletar o usuario",
                error: error
            })
    }
}
