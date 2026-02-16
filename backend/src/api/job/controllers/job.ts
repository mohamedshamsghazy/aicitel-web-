import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::job.job', ({ strapi }) => ({
    async find(ctx) {
        // Force filters for public API
        // If not admin (you might want to check ctx.state.user for admin access if mixed, 
        // but typically public API is for frontend)

        // We append filters to the query
        const { query } = ctx;

        // Logic: Status = Open AND (ClosingDate is null OR ClosingDate >= Today)
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const filters = {
            ...(query.filters as object || {}),
            jobStatus: 'Open',
            $or: [
                { closingDate: { $null: true } },
                { closingDate: { $gte: today } },
            ],
        };

        ctx.query = { ...query, filters };

        return super.find(ctx);
    },

    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;

        const today = new Date().toISOString().split('T')[0];

        // We can't easily inject filters into findOne core controller like find, 
        // so we fetch manually or check after fetch. 
        // Let's rely on entityService to ensure we only get valid jobs.

        const entity = await strapi.entityService.findOne('api::job.job', id, {
            ...query,
            populate: query.populate,
        });

        if (!entity) {
            return ctx.notFound();
        }

        // Check Logic
        const isOpen = entity.jobStatus === 'Open';
        const isNotExpired = !entity.closingDate || entity.closingDate >= today;

        if (!isOpen || !isNotExpired) {
            return ctx.notFound(); // Hide closed/expired jobs
        }

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
    }
}));
