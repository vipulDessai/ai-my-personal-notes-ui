import { useEffect } from "react";
import {
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Head from "next/head";
import { useLazyQuery } from "@apollo/client";

import commonStyles from "../styles/common.module.scss";
import homePageStyles from "./index.module.scss";

import { Header, Footer } from "../components";
import { pageTitles } from "../components/utils";

import { gql } from "../gql";

const GET_NOTES_QUERY = gql(`
  query getNoteInBatch($size: Int!, $page: Int!) {
    notes(input: { batchSize: $size, page: $page }) {
      notes {
        key
        value {
          title
          tags
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
          tagsIds = [...curNote.tags];
        }
      }

      if (tagsIds) getNotesTagsLazy({ variables: { tagsIds } });
    }
  }, [loadingNotes]);

  const makeGraphQlLambdaCall = async () => {
    getNotesLazy({ variables: { size: 10, page: 0 } });
  };

  useEffect(() => {
    makeGraphQlLambdaCall();
  }, []);

  const notes = getNotesRes && getNotesRes.notes && getNotesRes.notes.notes;

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
          {getNotesError?.message}
          {notes && notes.length > 0 && (
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {notes.map((note) => {
                const { title, tags: tagIds } = note.value;

                return (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        key={note.key}
                        primary={title}
                        secondary={tagIds?.map((t) => (
                          <Chip label={t} variant="outlined" />
                        ))}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </>
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
