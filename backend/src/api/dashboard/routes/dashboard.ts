
export default {
    routes: [
        {
            method: 'GET',
            path: '/dashboard/metrics',
            handler: 'dashboard.index',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
