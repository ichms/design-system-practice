const tailwindConfig = {
  theme: {
    extend: {
      // NOTE: 이전 임시 스타일(버튼용 색/타이포)은 토큰 기반 설계로 교체하기 위해 주석 처리했습니다.
      // colors: {
      //   // ConfirmButton 스타일과 통일: neutral-900 / neutral-800
      //   primary: {
      //     DEFAULT: '#171717', // neutral-900
      //     500: '#525252', // neutral-600 (focus ring)
      //     700: '#262626', // neutral-800
      //     800: '#404040', // neutral-700
      //   },
      //   secondary: {
      //     DEFAULT: '#64748b',
      //     700: '#475569',
      //     800: '#334155',
      //   },
      // },
      // borderRadius: {
      //   'radius-md': '0.375rem',
      //   'radius-lg': '0.5rem',
      //   'radius-xl': '0.75rem',
      // },
      // fontSize: {
      //   '4XL-Bold': ['48px', { fontWeight: 700, lineHeight: '60px' }],
      //   '4XL-Medium': ['48px', { fontWeight: 500, lineHeight: '60px' }],
      //   '4XL-Regular': ['48px', { fontWeight: 400, lineHeight: '60px' }],
      //   '4XL-Light': ['48px', { fontWeight: 400, lineHeight: '60px' }],
      //   // ...생략
      // },

      // -------------------------------------------------------------------
      // 디자인 토큰 기반 설정 (Colors / Opacity / Radius / Space / Font Size)
      // -------------------------------------------------------------------
      colors: {
        // _Colors.Common
        common: {
          0: '#000000',
          100: '#ffffff',
        },
        // _Colors.Neutral
        neutral: {
          5: '#171719',
          10: '#171717',
          15: '#1c1c1c',
          20: '#2a2a2a',
          22: '#303030',
          30: '#474747',
          40: '#5c5c5c',
          50: '#737373',
          60: '#8a8a8a',
          70: '#9b9b9b',
          80: '#b0b0b0',
          90: '#c4c4c4',
          95: '#dcdcdc',
          99: '#f7f7f7',
        },
        // _Colors.Cool Neutral
        coolNeutral: {
          5: '#0f0f10',
          7: '#141415',
          10: '#171719',
          15: '#1b1c1e',
          17: '#212225',
          20: '#292a2d',
          22: '#2e2f33',
          23: '#333438',
          25: '#37383c',
          30: '#46474c',
          40: '#5a5c63',
          50: '#70737c',
          60: '#878a93',
          70: '#989ba2',
          80: '#aeb0b6',
          90: '#c2c4c8',
          95: '#dbdcdf',
          96: '#e1e2e4',
          97: '#eaebec',
          98: '#f4f4f5',
          99: '#f7f7f8',
        },
        // _Colors.Blue Grey
        blueGrey: {
          10: '#334148',
          20: '#445760',
          30: '#536b75',
          40: '#63808c',
          50: '#6f909e',
          60: '#86a1ad',
          70: '#9cb3be',
          80: '#b9c9d1',
          90: '#d3dfe4',
          99: '#edf2f5',
        },
        // _Colors.Blue
        blue: {
          10: '#001433',
          20: '#002966',
          30: '#003d99',
          40: '#0052cc',
          50: '#1a71ff',
          60: '#3385ff',
          70: '#66a3ff',
          80: '#99c2ff',
          90: '#cbdffe',
          95: '#eaf2fe',
          99: '#f5faff',
        },
        // _Colors.Red
        red: {
          10: '#660c00',
          20: '#991200',
          30: '#cc1800',
          40: '#ff1e00',
          50: '#ff341a',
          60: '#ff4b33',
          70: '#ff7866',
          80: '#ffa599',
          90: '#ffd2cc',
          95: '#ffedeb',
          99: '#fff6f5',
        },
        // _Colors.Orange
        orange: {
          10: '#4d2d00',
          20: '#804a00',
          30: '#b26800',
          40: '#e58600',
          50: '#ff9500',
          60: '#ff9f1a',
          70: '#ffb54d',
          80: '#ffca80',
          90: '#ffdba8',
          95: '#ffeacc',
          99: '#fff6eb',
        },

        // Semantic.Mode 1.tokens.json → semantic 색상
        semantic: {
          primary: {
            primary: '#1a71ff', // {_Colors.Blue.50}
            dark: '#003d99', // {_Colors.Blue.30}
          },
          bg: {
            base: '#ffffff', // {_Colors.Common.100}
            dark: '#002966', // {_Colors.Blue.20}
            elevated: '#edf2f5', // {_Colors.Blue Grey.99}
            subtle: '#f4f4f5', // {_Colors.Cool Neutral.98}
            disabled: '#eaebec', // {_Colors.Cool Neutral.97}
          },
          text: {
            default: '#171719', // {_Colors.Neutral.5}
            sub: '#70737c', // {_Colors.Cool Neutral.50}
            muted: '#989ba2', // {_Colors.Cool Neutral.70}
            disabled: '#c2c4c8', // {_Colors.Cool Neutral.90}
            primary: '#1a71ff', // {_Colors.Blue.50}
            lightDefault: '#ffffff', // {_Colors.Common.100}
            lightSub: '#dbdcdf', // {_Colors.Cool Neutral.95}
            lightDisabled: '#5c5c5c', // {_Colors.Cool Neutral.40} 근사값
            success: '#1a71ff', // {_Colors.Blue.50}
            error: '#ff341a', // {_Colors.Red.50}
          },
          icon: {
            default: '#1c1c1c', // {_Colors.Neutral.15}
            sub: '#70737c', // {_Colors.Cool Neutral.50}
            muted: '#c2c4c8', // {_Colors.Cool Neutral.90}
            light: '#f7f7f7', // {_Colors.Neutral.99}
          },
          button: {
            block: {
              blue: {
                normalBg: '#1a71ff', // {_Colors.Blue.50}
                pressedBg: '#0052cc', // {_Colors.Blue.40}
                disableBg: '#eaebec', // {_Colors.Cool Neutral.97}
                selectBorder: '#99c2ff', // {_Colors.Blue.80}
              },
              grey: {
                normalBg: '#edf2f5', // {_Colors.Blue Grey.99}
                pressedBg: '#d3dfe4', // {_Colors.Blue Grey.90}
                disableBg: '#eaebec', // {_Colors.Cool Neutral.97}
                selectBorder: '#d3dfe4', // {_Colors.Blue Grey.90}
              },
            },
            lineButton: {
              line: '#737373', // {_Colors.Neutral.50}
            },
          },
          border: {
            base: '#dbdcdf', // {_Colors.Cool Neutral.95}
            selected: '#171719', // {_Colors.Neutral.10}
            secondary: '#eaebec', // {_Colors.Cool Neutral.97}
            tertiary: '#f7f7f8', // {_Colors.Cool Neutral.99}
            primary: '#1a71ff', // {_Colors.Blue.50}
            primaryDisabled: '#99c2ff', // {_Colors.Blue.80}
            error: '#ff341a', // {_Colors.Red.50}
            errorDisabled: '#ffa599', // {_Colors.Red.80}
          },
        },
      },

      // _Opacity
      opacity: {
        10: 0.1,
        20: 0.2,
        30: 0.3,
        50: 0.5,
        70: 0.7,
        100: 0.7, // 토큰 기준 값 유지
      },

      // _Border Radius
      borderRadius: {
        radius: '0px',
        'radius-2': '2px',
        'radius-4': '4px',
        'radius-6': '6px',
        'radius-8': '8px',
        'radius-12': '12px',
        'radius-16': '16px',
        'radius-20': '20px',
        'radius-24': '24px',
        'radius-1000': '1000px',
      },

      // _Space → spacing
      spacing: {
        0: '0px',
        2: '2px',
        3: '3px',
        4: '4px',
        6: '6px',
        8: '8px',
        10: '10px',
        12: '12px',
        14: '14px',
        16: '16px',
        20: '20px',
        24: '24px',
        32: '32px',
        40: '40px',
        48: '48px',
        56: '56px',
      },

      // Font.Mode 1.tokens.json → 기본 폰트 사이즈 토큰
      fontSize: {
        11: '11px',
        12: '12px',
        14: '14px',
        15: '15px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
        26: '26px',
        32: '32px',
        40: '40px',
        48: '48px',
        76: '76px',

        //
        // 사용 예시:
        // - className="text-displayXL-B"   → Bold
        // - className="text-displayXL-SB"  → SemiBold
        // - className="text-displayXL-M"   → Medium
        // - className="text-displayXL-R"   → Regular
        'displayXL-B': ['76px', { fontWeight: 700, lineHeight: '94px' }],
        'displayXL-SB': ['76px', { fontWeight: 600, lineHeight: '94px' }],
        'displayXL-M': ['76px', { fontWeight: 500, lineHeight: '94px' }],
        'displayXL-R': ['76px', { fontWeight: 400, lineHeight: '94px' }],

        // Display Sm (48 / 58)
        'displaySm-B': ['48px', { fontWeight: 700, lineHeight: '58px' }],
        'displaySm-SB': ['48px', { fontWeight: 600, lineHeight: '58px' }],
        'displaySm-M': ['48px', { fontWeight: 500, lineHeight: '58px' }],
        'displaySm-R': ['48px', { fontWeight: 400, lineHeight: '58px' }],

        // Headline XL (40 / 48)
        'headlineXL-B': ['40px', { fontWeight: 700, lineHeight: '48px' }],
        'headlineXL-SB': ['40px', { fontWeight: 600, lineHeight: '48px' }],
        'headlineXL-M': ['40px', { fontWeight: 500, lineHeight: '48px' }],
        'headlineXL-R': ['40px', { fontWeight: 400, lineHeight: '48px' }],

        // Headline Lg (32 / 40)
        'headlineLg-B': ['32px', { fontWeight: 700, lineHeight: '40px' }],
        'headlineLg-SB': ['32px', { fontWeight: 600, lineHeight: '40px' }],
        'headlineLg-M': ['32px', { fontWeight: 500, lineHeight: '40px' }],
        'headlineLg-R': ['32px', { fontWeight: 400, lineHeight: '40px' }],

        // Headline Md (26 / 34)
        'headlineMd-B': ['26px', { fontWeight: 700, lineHeight: '34px' }],
        'headlineMd-SB': ['26px', { fontWeight: 600, lineHeight: '34px' }],
        'headlineMd-M': ['26px', { fontWeight: 500, lineHeight: '34px' }],
        'headlineMd-R': ['26px', { fontWeight: 400, lineHeight: '34px' }],

        // Headline Sm (24 / 32)
        'headlineSm-B': ['24px', { fontWeight: 700, lineHeight: '32px' }],
        'headlineSm-SB': ['24px', { fontWeight: 600, lineHeight: '32px' }],
        'headlineSm-M': ['24px', { fontWeight: 500, lineHeight: '32px' }],
        'headlineSm-R': ['24px', { fontWeight: 400, lineHeight: '32px' }],

        // Title Lg (22 / 30)
        'titleLg-B': ['22px', { fontWeight: 700, lineHeight: '30px' }],
        'titleLg-SB': ['22px', { fontWeight: 600, lineHeight: '30px' }],
        'titleLg-M': ['22px', { fontWeight: 500, lineHeight: '30px' }],
        'titleLg-R': ['22px', { fontWeight: 400, lineHeight: '30px' }],

        // Title Md (20 / 28)
        'titleMd-B': ['20px', { fontWeight: 700, lineHeight: '28px' }],
        'titleMd-SB': ['20px', { fontWeight: 600, lineHeight: '28px' }],
        'titleMd-M': ['20px', { fontWeight: 500, lineHeight: '28px' }],
        'titleMd-R': ['20px', { fontWeight: 400, lineHeight: '28px' }],

        // Title Sm (18 / 26)
        'titleSm-B': ['18px', { fontWeight: 700, lineHeight: '26px' }],
        'titleSm-SB': ['18px', { fontWeight: 600, lineHeight: '26px' }],
        'titleSm-M': ['18px', { fontWeight: 500, lineHeight: '26px' }],
        'titleSm-R': ['18px', { fontWeight: 400, lineHeight: '26px' }],

        // Body Lg (16 / 24)
        'bodyLg-B': ['16px', { fontWeight: 700, lineHeight: '24px' }],
        'bodyLg-SB': ['16px', { fontWeight: 600, lineHeight: '24px' }],
        'bodyLg-M': ['16px', { fontWeight: 500, lineHeight: '24px' }],
        'bodyLg-R': ['16px', { fontWeight: 400, lineHeight: '24px' }],

        // Body Md (15 / 20)
        'bodyMd-B': ['15px', { fontWeight: 700, lineHeight: '20px' }],
        'bodyMd-SB': ['15px', { fontWeight: 600, lineHeight: '20px' }],
        'bodyMd-M': ['15px', { fontWeight: 500, lineHeight: '20px' }],
        'bodyMd-R': ['15px', { fontWeight: 400, lineHeight: '20px' }],

        // Body Sm (14 / 20)
        'bodySm-B': ['14px', { fontWeight: 700, lineHeight: '20px' }],
        'bodySm-SB': ['14px', { fontWeight: 600, lineHeight: '20px' }],
        'bodySm-M': ['14px', { fontWeight: 500, lineHeight: '20px' }],
        'bodySm-R': ['14px', { fontWeight: 400, lineHeight: '20px' }],

        // Caption Lg (12 / 18)
        'captionLg-B': ['12px', { fontWeight: 700, lineHeight: '18px' }],
        'captionLg-SB': ['12px', { fontWeight: 600, lineHeight: '18px' }],
        'captionLg-M': ['12px', { fontWeight: 500, lineHeight: '18px' }],
        'captionLg-R': ['12px', { fontWeight: 400, lineHeight: '18px' }],

        // Caption Md (11 / 14)
        'captionMd-B': ['11px', { fontWeight: 700, lineHeight: '14px' }],
        'captionMd-SB': ['11px', { fontWeight: 600, lineHeight: '14px' }],
        'captionMd-M': ['11px', { fontWeight: 500, lineHeight: '14px' }],
        'captionMd-R': ['11px', { fontWeight: 400, lineHeight: '14px' }],
      },

      // Figma Font Family / Letter Spacing
      fontFamily: {
        // Pretendard 기본 폰트 패밀리
        pretendard: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        // Display 관련 자간 -2%
        displayXL: '-0.02em',
        displaySm: '-0.02em',
        // headline 관련 자간 -1%
        headlineXL: '-0.01em',
        headlineLg: '-0.01em',
        headlineMd: '-0.01em',
        headlineSm: '-0.01em',
        // title 관련 자간 0%
        titleLg: '0em',
        titleMd: '0em',
        titleSm: '0em',
        // body 관련 자간 0%
        bodyLg: '0em',
        bodyMd: '0em',
        bodySm: '0em',
        // caption 관련 자간 0%
        captionLg: '0em',
        captionMd: '0em',
      },
    },
  },
};

export default tailwindConfig;
export { tailwindConfig };
