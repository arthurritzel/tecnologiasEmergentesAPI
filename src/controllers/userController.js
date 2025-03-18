import httpStatus from 'http-status';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

const baseUrl = '/api/user';

const generateLinks = (userId) => ({
    self: { href: `${baseUrl}/${userId}`, method: 'GET', rel: 'self' },
    update: { href: `${baseUrl}/${userId}`, method: 'PUT', rel: 'update' },
    delete: { href: `${baseUrl}/${userId}`, method: 'DELETE', rel: 'delete' },
    list: { href: baseUrl, method: 'GET', rel: 'list' },
    create: { href: baseUrl, method: 'POST', rel: 'create' },
});

export const listUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(httpStatus.OK).json({
            length: users.length,
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                _links: generateLinks(user._id),
            })),
            _links: {
                self: { href: baseUrl, method: 'GET', rel: 'self' },
                create: { href: baseUrl, method: 'POST', rel: 'create' },
            },
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao listar os usuários",
            error: error.message,
        });
    }
};

export const showUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Usuário não encontrado" });
        }
        res.status(httpStatus.OK).json({
            id: user._id,
            name: user.name,
            email: user.email,
            _links: generateLinks(user._id),
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao obter o usuário",
            error: error.message,
        });
    }
};

export const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({ name, email, password: hashedPassword });
        res.status(httpStatus.CREATED).json({
            id: user._id,
            name: user.name,
            email: user.email,
            _links: generateLinks(user._id),
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao criar o usuário",
            error: error.message,
        });
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { password, ...updateData } = req.body;

        const find = await User.findById(userId);
        if (!find) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Usuário não encontrado" });
        }

        if (password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        res.status(httpStatus.OK).json({
            id: user._id,
            name: user.name,
            email: user.email,
            _links: generateLinks(user._id),
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao atualizar o usuário",
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const find = await User.findById(userId);

        if (!find) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Usuário não encontrado" });
        }

        await User.findByIdAndDelete(userId);
        res.status(httpStatus.OK).json({
            message: "Usuário deletado com sucesso",
            _links: {
                list: { href: baseUrl, method: 'GET', rel: 'list' },
                create: { href: baseUrl, method: 'POST', rel: 'create' },
            },
        });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "Erro ao deletar o usuário",
            error: error.message,
        });
    }
};
