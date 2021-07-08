import {createServer} from 'http';
import {app} from './src/app';
import {sequelize} from './src/sequelize';

const port = process.env.PORT || 3200;

(async () => {
    await sequelize.sync({force: false});

    createServer(app)
        .listen(
            port,
            () => console.info(`Server running on port ${port}`)
        );
})();
