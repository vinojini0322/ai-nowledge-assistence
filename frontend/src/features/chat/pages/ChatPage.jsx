import { useEffect, useRef, useState } from "react";

import {
  Add,
  DeleteOutlineOutlined,
  EditOutlined,
  Send,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ReactMarkdown from "react-markdown";

import {
  createConversation,
  deleteConversation,
  getConversations,
  renameConversation,
} from "../../conversations/api/conversationApi";

import { getConversationMessages, sendChatMessage } from "../api/messageApi";

import { queryKeys } from "../constants/queryKeys";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";
import useNotificationStore from "../../../store/notificationStore";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

function ChatPage() {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const [message, setMessage] = useState("");
  const [pageError, setPageError] = useState("");

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const [conversationToRename, setConversationToRename] = useState(null);

  const [renameTitle, setRenameTitle] = useState("");

  const [conversationToDelete, setConversationToDelete] = useState(null);

  const {
    data: conversations = [],
    isLoading: conversationsLoading,
    isError: conversationsError,
  } = useQuery({
    queryKey: queryKeys.conversations,
    queryFn: getConversations,
  });

  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
  } = useQuery({
    queryKey: queryKeys.conversationMessages(selectedConversationId),
    queryFn: () => getConversationMessages(selectedConversationId),
    enabled: Boolean(selectedConversationId),
  });

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const createMutation = useMutation({
    mutationFn: () => createConversation("New conversation"),

    onSuccess: (createdConversation) => {
      queryClient.setQueryData(queryKeys.conversations, (current = []) => [
        createdConversation,
        ...current,
      ]);

      showNotification({
        message: "Conversation created.",
        severity: "success",
      });

      setSelectedConversationId(createdConversation.id);
      setPageError("");
    },

    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Unable to create conversation.",
      );

      setPageError(message);

      showNotification({
        message,
        severity: "error",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,

    onSuccess: (response) => {
      queryClient.setQueryData(
        queryKeys.conversationMessages(selectedConversationId),
        (current = []) => [
          ...current,
          response.userMessage,
          response.assistantMessage,
        ],
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.conversations,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });

      setMessage("");
      setPageError("");
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Unable to send the message.");

      setPageError(message);

      showNotification({
        message,
        severity: "error",
      });
    },
  });

  const renameMutation = useMutation({
    mutationFn: renameConversation,

    onSuccess: (updatedConversation) => {
      queryClient.setQueryData(queryKeys.conversations, (current = []) =>
        current.map((conversation) =>
          conversation.id === updatedConversation.id
            ? updatedConversation
            : conversation,
        ),
      );

      showNotification({
        message: "Conversation renamed.",
        severity: "success",
      });

      setRenameDialogOpen(false);
      setConversationToRename(null);
      setRenameTitle("");
      setPageError("");
    },

    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Unable to rename conversation.",
      );

      setPageError(message);

      showNotification({
        message,
        severity: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConversation,

    onSuccess: (_, deletedConversationId) => {
      queryClient.setQueryData(queryKeys.conversations, (current = []) =>
        current.filter(
          (conversation) => conversation.id !== deletedConversationId,
        ),
      );

      queryClient.removeQueries({
        queryKey: queryKeys.conversationMessages(deletedConversationId),
      });

      if (selectedConversationId === deletedConversationId) {
        const remainingConversations = conversations.filter(
          (conversation) => conversation.id !== deletedConversationId,
        );

        setSelectedConversationId(remainingConversations[0]?.id || null);
      }

      showNotification({
        message: "Conversation deleted.",
        severity: "success",
      });

      setPageError("");
    },

    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Unable to delete conversation.",
      );

      setPageError(message);

      showNotification({
        message,
        severity: "error",
      });
    },
  });

  const handleCreateConversation = () => {
    createMutation.mutate();
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || !selectedConversationId) {
      return;
    }

    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      message: trimmedMessage,
    });
  };

  const handleMessageKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(event);
    }
  };

  const handleOpenRenameDialog = (event, conversation) => {
    event.stopPropagation();

    setConversationToRename(conversation);
    setRenameTitle(conversation.title || "");
    setRenameDialogOpen(true);
  };

  const handleRename = () => {
    const trimmedTitle = renameTitle.trim();

    if (!trimmedTitle || !conversationToRename) {
      return;
    }

    renameMutation.mutate({
      conversationId: conversationToRename.id,
      title: trimmedTitle,
    });
  };

  const handleDelete = (event, conversationId) => {
    event.stopPropagation();

    setConversationToDelete(conversationId);
  };

  const getConversationTitle = (conversation) => {
    return conversation.title?.trim() || "Untitled conversation";
  };

  const handleConfirmDeleteConversation = () => {
    if (!conversationToDelete) {
      return;
    }

    deleteMutation.mutate(conversationToDelete);

    setConversationToDelete(null);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleteMutation.isPending) {
      setConversationToDelete(null);
    }
  };

  return (
    <>
      <Box
        sx={{
          height: {
            xs: "calc(100vh - 120px)",
            md: "calc(100vh - 128px)",
          },
          display: "flex",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "background.paper",
        }}
      >
        <Box
          component="aside"
          sx={{
            width: {
              xs: 220,
              md: 300,
            },
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateConversation}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "New conversation"}
            </Button>
          </Box>

          <Divider />

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            {conversationsLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 3,
                }}
              >
                <CircularProgress size={28} />
              </Box>
            )}

            {conversationsError && (
              <Alert severity="error" sx={{ m: 2 }}>
                Unable to load conversations.
              </Alert>
            )}

            {!conversationsLoading && conversations.length === 0 && (
              <Typography
                color="text.secondary"
                textAlign="center"
                sx={{ p: 3 }}
              >
                No conversations yet.
              </Typography>
            )}

            <List disablePadding>
              {conversations.map((conversation) => (
                <ListItemButton
                  key={conversation.id}
                  selected={selectedConversationId === conversation.id}
                  onClick={() => setSelectedConversationId(conversation.id)}
                  sx={{
                    py: 1.5,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <ListItemText
                    primary={getConversationTitle(conversation)}
                    primaryTypographyProps={{
                      noWrap: true,
                    }}
                  />

                  <Tooltip title="Rename">
                    <IconButton
                      size="small"
                      onClick={(event) =>
                        handleOpenRenameDialog(event, conversation)
                      }
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(event) => handleDelete(event, conversation.id)}
                    >
                      <DeleteOutlineOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {pageError && (
            <Alert
              severity="error"
              onClose={() => setPageError("")}
              sx={{ borderRadius: 0 }}
            >
              {pageError}
            </Alert>
          )}

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: {
                xs: 2,
                md: 3,
              },
            }}
          >
            {!selectedConversationId && (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{ height: "100%" }}
              >
                <Typography variant="h5">Start a conversation</Typography>

                <Typography color="text.secondary">
                  Create a new conversation to begin chatting.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreateConversation}
                >
                  New conversation
                </Button>
              </Stack>
            )}

            {selectedConversationId && messagesLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pt: 5,
                }}
              >
                <CircularProgress />
              </Box>
            )}

            {selectedConversationId && messagesError && (
              <Alert severity="error">Unable to load messages.</Alert>
            )}

            {selectedConversationId &&
              !messagesLoading &&
              messages.length === 0 && (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  sx={{ height: "100%" }}
                >
                  <Typography variant="h5">How can I help you?</Typography>

                  <Typography color="text.secondary">
                    Type a message below to start the chat.
                  </Typography>
                </Stack>
              )}

            <Stack spacing={2}>
              {messages.map((chatMessage) => {
                const isUser = chatMessage.role === "USER";

                return (
                  <Box
                    key={chatMessage.id}
                    sx={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        maxWidth: {
                          xs: "90%",
                          md: "75%",
                        },
                        px: 2,
                        py: 1.5,
                        backgroundColor: isUser
                          ? "primary.main"
                          : "action.hover",
                        color: isUser ? "primary.contrastText" : "text.primary",
                        borderRadius: 2,
                      }}
                    >
                      {isUser ? (
                        <Typography
                          sx={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {chatMessage.content}
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            overflowWrap: "anywhere",

                            "& p": {
                              mt: 0,
                              mb: 1,
                            },

                            "& p:last-child": {
                              mb: 0,
                            },

                            "& pre": {
                              overflowX: "auto",
                              p: 1.5,
                              borderRadius: 1,
                              backgroundColor: "grey.900",
                              color: "common.white",
                            },

                            "& code": {
                              fontFamily: "monospace",
                            },
                          }}
                        >
                          <ReactMarkdown>{chatMessage.content}</ReactMarkdown>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                );
              })}

              {sendMessageMutation.isPending && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      px: 2,
                      py: 1.5,
                      backgroundColor: "action.hover",
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} />

                      <Typography color="text.secondary">
                        AI is thinking...
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Stack>
          </Box>

          <Divider />

          <Box
            component="form"
            onSubmit={handleSendMessage}
            sx={{
              p: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                multiline
                maxRows={5}
                placeholder={
                  selectedConversationId
                    ? "Message AI Knowledge Assistant..."
                    : "Create a conversation first"
                }
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleMessageKeyDown}
                disabled={
                  !selectedConversationId || sendMessageMutation.isPending
                }
                inputProps={{
                  maxLength: 10000,
                }}
              />

              <IconButton
                type="submit"
                color="primary"
                disabled={
                  !selectedConversationId ||
                  !message.trim() ||
                  sendMessageMutation.isPending
                }
                sx={{
                  width: 44,
                  height: 44,
                }}
              >
                <Send />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Rename conversation</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            label="Conversation title"
            value={renameTitle}
            onChange={(event) => setRenameTitle(event.target.value)}
            inputProps={{
              maxLength: 255,
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            onClick={handleRename}
            disabled={!renameTitle.trim() || renameMutation.isPending}
          >
            {renameMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={Boolean(conversationToDelete)}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        loading={deleteMutation.isPending}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteConversation}
      />
    </>
  );
}

export default ChatPage;
