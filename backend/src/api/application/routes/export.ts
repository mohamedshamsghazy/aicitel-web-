
export default {
    routes: [
        {
            method: 'GET',
            path: '/applications/export',
            handler: 'application.export',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
