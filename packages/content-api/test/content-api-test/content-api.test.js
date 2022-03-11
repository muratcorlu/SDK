// Switch these lines once there are useful utils
// const testUtils = require('./utils');

const should = require('should');

const GhostContentApi = require('../../cjs/content-api');

describe('GhostContentApi', function () {
    const config = {
        url: 'https://ghost.local',
        version: 'v2',
        key: '0123456789abcdef0123456789'
    };

    describe('new GhostContentApi', function () {
        it('Requires a config object with url, version and key', function () {
            try {
                new GhostContentApi();
                return should.fail();
            } catch (err) {
            //
            }

            try {
                new GhostContentApi({url: config.url, version: config.version});
                return should.fail();
            } catch (err) {
            //
            }

            try {
                new GhostContentApi({version: config.version, key: config.key});
                return should.fail();
            } catch (err) {
            //
            }

            try {
                new GhostContentApi({url: config.url, key: config.key});
                return should.fail();
            } catch (err) {
            //
            }

            new GhostContentApi({host: config.url, key: config.key, version: config.version});
            new GhostContentApi(config);
        });

        it('Returns an "api" object with posts, tags, authors, pages, and settings properties', function () {
            const api = new GhostContentApi(config);

            should.exist(api.posts);
            should.exist(api.tags);
            should.exist(api.authors);
            should.exist(api.pages);
            should.exist(api.settings);
        });
    });

    describe('makeApiRequest', function () {
        it('Can override makeRequest through constructor parameter', async function (){
            const makeRequestStub = sinon.stub().returns(Promise.resolve({
                data: {
                    settings: {}
                }
            }));
            const api = new GhostContentApi({
                url: 'https://ghost.local',
                version: 'v4',
                key: '0123456789abcdef0123456789',
                makeRequest: makeRequestStub
            });

            await api.settings.browse();

            makeRequestStub.calledOnce.should.be.true();
            should.equal(makeRequestStub.args[0][0].params.key, '0123456789abcdef0123456789');
        });

        it('Adds Accept-Version header for v4, v5, canary, and no API versions', async function () {
            const makeRequestStub = sinon.stub().returns(Promise.resolve({
                data: {
                    settings: {}
                }
            }));

            const api = new GhostContentApi({
                version: 'canary',
                url: `http://ghost.local`,
                key: '0123456789abcdef0123456789',
                makeRequest: makeRequestStub
            });

            await api.settings.browse();

            makeRequestStub.calledOnce.should.be.true();
            should.equal(makeRequestStub.args[0][0].headers['Accept-Version'], 'canary');
        });

        it('Does NOT add Accept-Version header for v3 API', async function () {
            const makeRequestStub = sinon.stub().returns(Promise.resolve({
                data: {
                    settings: {}
                }
            }));

            const api = new GhostContentApi({
                version: 'v3',
                url: `http://ghost.local`,
                key: '0123456789abcdef0123456789',
                makeRequest: makeRequestStub
            });

            await api.settings.browse();

            makeRequestStub.calledOnce.should.be.true();
            should.equal(makeRequestStub.args[0][0].headers['Accept-Version'], undefined);
        });
    });
});
