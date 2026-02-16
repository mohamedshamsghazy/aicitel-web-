
import { factories } from '@strapi/strapi';

declare var strapi: any;

export default {
    async index(ctx) {
        try {
            // 1. Total Applications
            const totalApplications = await strapi.db.query('api::application.application').count();

            // 2. Active Jobs
            const activeJobs = await strapi.db.query('api::job.job').count({
                where: { status: 'Open' },
            });

            // 3. Applications this month
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const applicationsThisMonth = await strapi.db.query('api::application.application').count({
                where: {
                    createdAt: { $gte: firstDayOfMonth.toISOString() },
                },
            });

            // 4. Top 3 Jobs by Applications
            // @ts-ignore
            const jobs = await strapi.entityService.findMany('api::job.job', {
                populate: { applications: { count: true } },
            });

            const sortedJobs = (jobs as any[]).sort((a, b) => (b.applications?.count || 0) - (a.applications?.count || 0)).slice(0, 3);
            const topJobs = sortedJobs.map(job => ({
                title: job.title,
                count: job.applications?.count || 0
            }));

            // 5. Stage Distribution
            const applications = await strapi.entityService.findMany('api::application.application', {
                fields: ['stage'],
            });

            const stageDistribution = (applications as any[]).reduce((acc, app) => {
                acc[app.stage] = (acc[app.stage] || 0) + 1;
                return acc;
            }, {});

            // 6. Applications per month (Last 6 months)
            const months = {};
            for (let i = 0; i < 6; i++) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                months[key] = 0;
            }

            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
            sixMonthsAgo.setDate(1);

            const recentApps = await strapi.db.query('api::application.application').findMany({
                where: {
                    createdAt: { $gte: sixMonthsAgo.toISOString() },
                },
                select: ['createdAt'],
            });

            recentApps.forEach(app => {
                const d = new Date(app.createdAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                if (months[key] !== undefined) {
                    months[key]++;
                }
            });

            ctx.body = {
                metrics: {
                    totalApplications,
                    activeJobs,
                    applicationsThisMonth,
                },
                topJobs,
                stageDistribution,
                applicationsPerMonth: Object.entries(months).map(([key, value]) => ({ month: key, count: value })).reverse(),
            };
        } catch (err) {
            ctx.throw(500, err);
        }
    },
};
