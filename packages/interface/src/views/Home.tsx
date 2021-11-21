import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import MuiButton, { ButtonProps } from "@mui/material/Button";
import Container from "@mui/material/Container";
import { styled, Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { Link, useHistory } from "react-router-dom";

import { useAppSelector } from "../hooks/redux";
import { NetworkService } from "../services/networkService";

export function Home(props: { backgroundImage: string }) {
  const { backgroundImage } = props;
  const { loading, network } = useAppSelector((state) => state.app);
  const history = useHistory();
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
        className={`bg-${network || "secondary"}`}
        variant="contained"
        size="large"
        LinkComponent={Link}
        disabled={loading}
        to={"/dashboard"}
        sx={{ minWidth: 200 }}
        onClick={() =>
          NetworkService.connectWithMoralis().then((isSuccess) => {
            if (isSuccess) {
              history.push("/dashboard");
            }
          })
        }
      >
        {loading ? "Connecting ..." : "Connect"}
      </Button>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Discover the experience
      </Typography>
    </ProductHeroLayout>
  );
}
const ProductHeroLayoutRoot = styled("section")(({ theme }) => ({
  color: theme.palette.common.white,
  position: "relative",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    height: "100vh",
    minHeight: 500,
    maxHeight: 1500,
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
      </Container>
    </ProductHeroLayoutRoot>
  );
};

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
