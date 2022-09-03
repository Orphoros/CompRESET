const config = {
    mode: 'jit',
    purge: [
        './src/**/*.{html,js,svelte,ts}'
    ],
    theme: {
        fontFamily: {
            'sans': ['Roboto', 'system-ui']
        },
        extend: {
            colors: {
                compResetBackground: '#212121',
                compResetThumbnailBG: '#2e2e2e',
                compResetOutline: '#6d0e8c',
                compResetText: '#b9b5ba',
                compResetButton: '#610e7d',
                compResetNavbar: '#2c013b',
                compResetPanel: '#303030',
                compResetInput: '#363636',
                compResetLink: '#d359ff'
            },
            outline: {
                outlineOrange: '2px solid #E36307'
            }
        }
    },
    variants: {
        outline: ['hover', 'active', 'focus'],
        border: ['hover', 'active', 'focus'],
        borderRadius: ['hover', 'active', 'focus'],
        backgroundColor: ['focus', 'even']
    },
    plugins: []
};

module.exports = config;
