import { useRef, useState } from "react";

import {
  CloudUploadOutlined,
  DeleteOutlineOutlined,
  DescriptionOutlined,
  Send,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
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
  askDocumentQuestion,
  deleteDocument,
  getDocuments,
  uploadDocument,
} from "../api/documentApi";

import { documentQueryKeys } from "../constants/queryKeys";
import getApiErrorMessage from "../../../utils/getApiErrorMessage";
import useNotificationStore from "../../../store/notificationStore";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ["application/pdf", "text/plain"];

function DocumentsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [pageError, setPageError] = useState("");
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const {
    data: documents = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: documentQueryKeys.documents,
    queryFn: getDocuments,
  });

  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,

    onSuccess: (uploadedDocument) => {
      queryClient.setQueryData(documentQueryKeys.documents, (current = []) => [
        uploadedDocument,
        ...current,
      ]);

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });

      showNotification({
        message: "Document uploaded successfully.",
        severity: "success",
      });

      setSelectedDocumentId(uploadedDocument.id);
      setChatHistory([]);
      setPageError("");
    },

    onError: (error) => {
      const message = getApiErrorMessage(error, "Unable to upload document.");

      setPageError(message);

      showNotification({
        message,
        severity: "error",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,

    onSuccess: (_, deletedDocumentId) => {
      queryClient.setQueryData(documentQueryKeys.documents, (current = []) =>
        current.filter((document) => document.id !== deletedDocumentId),
      );

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });

      if (selectedDocumentId === deletedDocumentId) {
        setSelectedDocumentId(null);
        setChatHistory([]);
      }

      showNotification({
        message: "Document deleted successfully.",
        severity: "success",
      });

      setPageError("");
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Unable to delete document.");

      setPageError(message);

      showNotification({
        message,
        severity: "error",
      });
    },
  });

  const askMutation = useMutation({
    mutationFn: askDocumentQuestion,

    onSuccess: (response) => {
      setChatHistory((current) => [
        ...current,
        {
          question: response.question,
          answer: response.answer,
        },
      ]);

      setQuestion("");
      setPageError("");
    },
    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Unable to answer the question.",
      );

      setPageError(message);

      showNotification({
        message,
        severity: "error",
      });
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setPageError("Only PDF and TXT files are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setPageError("File size must not exceed 10 MB.");
      return;
    }

    setPageError("");
    uploadMutation.mutate(file);
  };

  const handleSelectDocument = (documentId) => {
    setSelectedDocumentId(documentId);
    setChatHistory([]);
    setQuestion("");
    setPageError("");
  };

  const handleConfirmDeleteDocument = () => {
    if (!documentToDelete) {
      return;
    }

    deleteMutation.mutate(documentToDelete);

    setDocumentToDelete(null);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleteMutation.isPending) {
      setDocumentToDelete(null);
    }
  };

  const handleDeleteDocument = (event, documentId) => {
    event.stopPropagation();

    setDocumentToDelete(documentId);
  };

  const handleSubmitQuestion = (event) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!selectedDocumentId || !trimmedQuestion) {
      return;
    }

    askMutation.mutate({
      documentId: selectedDocumentId,
      question: trimmedQuestion,
    });
  };

  const selectedDocument = documents.find(
    (document) => document.id === selectedDocumentId,
  );

  return (
    <Box>
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700}>
            Document Chat
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Upload a PDF or TXT file and ask questions about it.
          </Typography>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          hidden
          onChange={handleFileChange}
        />

        <Button
          variant="contained"
          startIcon={
            uploadMutation.isPending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <CloudUploadOutlined />
            )
          }
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? "Uploading..." : "Upload document"}
        </Button>
      </Stack>

      {pageError && (
        <Alert severity="error" onClose={() => setPageError("")} sx={{ mb: 2 }}>
          {pageError}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "320px minmax(0, 1fr)",
          },
          gap: 3,
        }}
      >
        <Paper
          elevation={1}
          sx={{
            minHeight: 500,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Your documents
            </Typography>
          </Box>

          <Divider />

          {isLoading && (
            <Box
              sx={{
                p: 4,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {isError && (
            <Alert severity="error" sx={{ m: 2 }}>
              Unable to load documents.
            </Alert>
          )}

          {!isLoading && documents.length === 0 && (
            <Stack alignItems="center" spacing={1} sx={{ p: 4 }}>
              <DescriptionOutlined color="disabled" fontSize="large" />

              <Typography color="text.secondary">
                No documents uploaded.
              </Typography>
            </Stack>
          )}

          <List disablePadding>
            {documents.map((document) => (
              <ListItemButton
                key={document.id}
                selected={selectedDocumentId === document.id}
                onClick={() => handleSelectDocument(document.id)}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <ListItemIcon>
                  <DescriptionOutlined />
                </ListItemIcon>

                <ListItemText
                  primary={document.fileName}
                  secondary={document.fileType}
                  primaryTypographyProps={{
                    noWrap: true,
                  }}
                />

                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(event) =>
                      handleDeleteDocument(event, document.id)
                    }
                    disabled={deleteMutation.isPending}
                  >
                    <DeleteOutlineOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItemButton>
            ))}
          </List>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            minHeight: 500,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {!selectedDocument ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{
                flex: 1,
                p: 4,
                textAlign: "center",
              }}
            >
              <DescriptionOutlined color="disabled" sx={{ fontSize: 56 }} />

              <Typography variant="h5">Select a document</Typography>

              <Typography color="text.secondary">
                Choose an uploaded document or upload a new one.
              </Typography>
            </Stack>
          ) : (
            <>
              <Box sx={{ p: 2.5 }}>
                <Typography variant="h6" fontWeight={700} noWrap>
                  {selectedDocument.fileName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {selectedDocument.fileType}
                </Typography>
              </Box>

              <Divider />

              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 3,
                }}
              >
                {chatHistory.length === 0 && (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{
                      height: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h5">
                      Ask about this document
                    </Typography>

                    <Typography color="text.secondary">
                      Enter a question below to analyze its contents.
                    </Typography>
                  </Stack>
                )}

                <Stack spacing={3}>
                  {chatHistory.map((entry, index) => (
                    <Box key={`${entry.question}-${index}`}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mb: 1.5,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            maxWidth: "80%",
                            px: 2,
                            py: 1.5,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                          }}
                        >
                          <Typography
                            sx={{
                              whiteSpace: "pre-wrap",
                              overflowWrap: "anywhere",
                            }}
                          >
                            {entry.question}
                          </Typography>
                        </Paper>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            maxWidth: "90%",
                            px: 2,
                            py: 1.5,
                            bgcolor: "action.hover",
                          }}
                        >
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
                                bgcolor: "grey.900",
                                color: "common.white",
                              },
                            }}
                          >
                            <ReactMarkdown>{entry.answer}</ReactMarkdown>
                          </Box>
                        </Paper>
                      </Box>
                    </Box>
                  ))}

                  {askMutation.isPending && (
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
                          bgcolor: "action.hover",
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CircularProgress size={18} />

                          <Typography color="text.secondary">
                            Analyzing document...
                          </Typography>
                        </Stack>
                      </Paper>
                    </Box>
                  )}
                </Stack>
              </Box>

              <Divider />

              <Box
                component="form"
                onSubmit={handleSubmitQuestion}
                sx={{ p: 2 }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-end">
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Ask a question about this document..."
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    disabled={askMutation.isPending}
                    inputProps={{
                      maxLength: 5000,
                    }}
                  />

                  <IconButton
                    type="submit"
                    color="primary"
                    disabled={!question.trim() || askMutation.isPending}
                    sx={{
                      width: 44,
                      height: 44,
                    }}
                  >
                    <Send />
                  </IconButton>
                </Stack>
              </Box>
            </>
          )}
        </Paper>
      </Box>
      <ConfirmDialog
        open={Boolean(documentToDelete)}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        loading={deleteMutation.isPending}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDeleteDocument}
      />
    </Box>
  );
}

export default DocumentsPage;
