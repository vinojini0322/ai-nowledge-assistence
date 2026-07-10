import {
  ChatBubbleOutlineOutlined,
  DescriptionOutlined,
  ForumOutlined,
  Refresh,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";

import { getDashboardSummary } from "../api/dashboardApi";
import { dashboardQueryKeys } from "../constants/queryKeys";

const dashboardCards = [
  {
    key: "conversationCount",
    title: "Conversations",
    description: "Total AI conversations",
    icon: <ForumOutlined fontSize="large" />,
  },
  {
    key: "messageCount",
    title: "Messages",
    description: "Total chat messages",
    icon: <ChatBubbleOutlineOutlined fontSize="large" />,
  },
  {
    key: "documentCount",
    title: "Documents",
    description: "Uploaded documents",
    icon: <DescriptionOutlined fontSize="large" />,
  },
];

function DashboardPage() {
  const {
    data: summary,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: dashboardQueryKeys.summary,
    queryFn: getDashboardSummary,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        {error?.response?.data?.message ||
          "Unable to load dashboard information."}
      </Alert>
    );
  }

  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Overview of your AI Knowledge Assistant activity.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={isFetching ? <CircularProgress size={18} /> : <Refresh />}
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Refresh
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {dashboardCards.map((card) => (
          <Grid
            key={card.key}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                height: "100%",
                p: 3,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography color="text.secondary" fontWeight={600}>
                    {card.title}
                  </Typography>

                  <Typography variant="h3" fontWeight={700} sx={{ mt: 1 }}>
                    {summary?.[card.key] ?? 0}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {card.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "primary.main",
                    backgroundColor: "action.hover",
                  }}
                >
                  {card.icon}
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper
        elevation={1}
        sx={{
          mt: 4,
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Quick actions
        </Typography>

        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ mt: 0.5, mb: 2 }}
        >
          Continue chatting or upload a document.
        </Typography>

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <Button
            component={RouterLink}
            to="/chat"
            variant="contained"
            startIcon={<ChatBubbleOutlineOutlined />}
          >
            Start AI chat
          </Button>

          <Button
            component={RouterLink}
            to="/documents"
            variant="outlined"
            startIcon={<DescriptionOutlined />}
          >
            Upload document
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default DashboardPage;
