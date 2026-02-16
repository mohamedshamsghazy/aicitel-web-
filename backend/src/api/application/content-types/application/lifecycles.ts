
export default {
    async afterCreate(event) {
        const { result } = event;

        try {
            // We use a try-catch block to ensure email failures don't block application creation
            // In a real scenario, make sure 'email' plugin is configured in plugins.ts
            if (strapi.plugins['email']) {
                // Email to Admin
                await strapi.plugins['email'].services.email.send({
                    to: 'info@aicitel-company.com',
                    from: 'no-reply@aicitel-company.com',
                    subject: `New Application: ${result.fullName}`,
                    text: `New application received from ${result.fullName} (${result.email}).\nPhone: ${result.phone}\n\nPlease check the dashboard to review.`,
                });

                // Email to Applicant
                await strapi.plugins['email'].services.email.send({
                    to: result.email,
                    from: 'no-reply@aicitel-company.com',
                    subject: 'Application Received - Aicitel',
                    text: `Dear ${result.fullName},\n\nThank you for applying to Aicitel. We have received your application and will review it shortly.\n\nBest regards,\nAicitel Recruitment Team`,
                });
            } else {
                strapi.log.warn('Email plugin not installed or configured. Skipping email notifications.');
            }
        } catch (err) {
            strapi.log.error('Failed to send email notification', err);
        }
    },
};
