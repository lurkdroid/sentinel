import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import Container from '@mui/material/Container';
import { styled, Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';

// import { Link } from 'react-router-dom';

const ProductHeroLayoutRoot = styled("section")(({ theme }) => ({
  color: theme.palette.common.white,
  position: "relative",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    height: "80vh",
    minHeight: 500,
    maxHeight: 1300,
  },
}));

const Background = styled(Box)({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  zIndex: -2,
});

interface ProductHeroLayoutProps {
  sxBackground: SxProps<Theme>;
}

export const ProductHeroLayout = (
  props: React.HTMLAttributes<HTMLDivElement> & ProductHeroLayoutProps
) => {
  const { sxBackground, children } = props;
  // <Link to="/dashboard">LAUNCH APP</Link>
  return (
    <ProductHeroLayoutRoot>
      <Container
        sx={{
          mt: 3,
          mb: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src="/images/assets/bg.jpg" alt="wonder" width="147" height="80" />
        {children}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "common.black",
            opacity: 0.5,
            zIndex: -1,
          }}
        />
        <Background sx={sxBackground} />
        <Box
          component="img"
          src="/images/assets.jpg"
          height="16"
          width="12"
          alt="Launch App"
          sx={{ position: "absolute", bottom: 32 }}
        />
      </Container>
    </ProductHeroLayoutRoot>
  );
};

export function Home(props: { backgroundImage: string }) {
  const { backgroundImage } = props;
  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: "#7fc7d9", // Average color of the background image.
        backgroundPosition: "center",
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: "none" }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Typography color="inherit" align="center" variant="h2" component="span">
        Upgrade your investment horizons in the crypto market.
      </Typography>
      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
      >
        No need to worry on your investments, SoliDroid got you covered!
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        component="a"
        href="/premium-themes/onepirate/sign-up/"
        sx={{ minWidth: 200 }}
        // onClick={()=>}
      >
        Connect
      </Button>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Discover the experience
      </Typography>
    </ProductHeroLayout>
  );
}

const ButtonRoot = styled(MuiButton)(({ theme, size }) => ({
  borderRadius: 0,
  fontWeight: theme.typography.fontWeightMedium,
  fontFamily: theme.typography.h1.fontFamily,
  padding: theme.spacing(2, 4),
  fontSize: theme.typography.pxToRem(14),
  boxShadow: "none",
  "&:active, &:focus": {
    boxShadow: "none",
  },
  ...(size === "small" && {
    padding: theme.spacing(1, 3),
    fontSize: theme.typography.pxToRem(13),
  }),
  ...(size === "large" && {
    padding: theme.spacing(2, 5),
    fontSize: theme.typography.pxToRem(16),
  }),
}));

// See https://mui.com/guides/typescript/#usage-of-component-prop for why the types uses `C`.
function Button<C extends React.ElementType>(
  props: ButtonProps<C, { component?: C }>
) {
  return <ButtonRoot {...props} />;
}
