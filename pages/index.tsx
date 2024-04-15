import { useEffect } from "react";
import {
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Head from "next/head";
import { useLazyQuery } from "@apollo/client";

import commonStyles from "../styles/common.module.scss";
import homePageStyles from "./index.module.scss";

import { Header, Footer } from "../components";
import { pageTitles, toDictionary } from "../components/utils";

import { gql } from "../gql";

const GET_NOTES_QUERY = gql(`
  query getNoteInBatch($size: Int!, $page: Int!) {
    notes(input: { batchSize: $size, page: $page }) {
      notes {
        key
        value {
          title
          tags
          date
          updatedDate
          inputData {
            value
          }
        }
      }
    }
  }
`);

const GET_NOTES_TAGS_QUERY = gql(`
  query getTags($tagsIds: [String!]!) {
    tags(input: {
      tagsIds: $tagsIds
    }) {
      tags {
        key
        value {
          name
        }
      }
    }
  }
`);

export default function Home() {
  const [
    getNotesLazy,
    { data: getNotesRes, loading: loadingNotes, error: getNotesError },
  ] = useLazyQuery(GET_NOTES_QUERY);
  const [
    getNotesTagsLazy,
    { data: getNotesTagRes, loading: loadingTags, error: getTagsError },
  ] = useLazyQuery(GET_NOTES_TAGS_QUERY);

  // TODO: fix the fetch tags by ids array
  useEffect(() => {
    if (
      !loadingNotes &&
      getNotesRes &&
      getNotesRes.notes &&
      getNotesRes.notes.notes
    ) {
      const notes = getNotesRes.notes.notes;
      let tagsIds: string[] = [];
      for (let i = 0; i < notes.length; ++i) {
        const curNote = notes[i].value;
        if (curNote.tags) {
          tagsIds = [...tagsIds, ...curNote.tags];
        }
      }

      if (tagsIds) getNotesTagsLazy({ variables: { tagsIds } });
    }
  }, [loadingNotes, getNotesRes, getNotesTagsLazy]);

  useEffect(() => {
    getNotesLazy({ variables: { size: 10, page: 0 } });
  }, [getNotesLazy]);

  const notes = getNotesRes?.notes?.notes;

  const tagsData = getNotesTagRes?.tags?.tags || [];
  const tagsDataDictionary = toDictionary(tagsData, "key", "value");

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>{pageTitles.HOME}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <section className={homePageStyles["api-call-tester"]}>
          {loadingNotes && <CircularProgress color="inherit" />}
          {/* TODO: properly show the error */}
          {getNotesError?.message && <p>{getNotesError.message}</p>}
          {getTagsError?.message && <p>{getTagsError.message}</p>}
          {notes && notes.length > 0 && (
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {notes.map((note) => {
                const { title, tags: tagsIds, date, updatedDate } = note.value;

                return (
                  <ListItem
                    key={note.key}
                    sx={{ flexDirection: "column", alignItems: "baseline" }}
                    divider={true}
                  >
                    <List
                      sx={{
                        width: "100%",
                        bgcolor: "background.paper",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      <ListItemText
                        key={note.key}
                        primary={date}
                        // secondary={updatedDate}
                      />
                    </List>
                    <ListItemText key={note.key} primary={title} />
                    <List
                      sx={{
                        width: "100%",
                        bgcolor: "background.paper",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {loadingTags && <CircularProgress color="inherit" />}
                      {!loadingTags &&
                        tagsData &&
                        tagsIds?.map((tagId) => (
                          <Chip
                            key={tagId}
                            label={tagsDataDictionary[tagId]?.name}
                            variant="outlined"
                          />
                        ))}
                    </List>
                  </ListItem>
                );
              })}
            </List>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
