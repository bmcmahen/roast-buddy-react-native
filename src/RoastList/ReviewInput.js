import React from "react";
import { Base, Button } from "../components";
import { TextInput, LayoutAnimation } from "react-native";
import shortid from "shortid";
import moment from "moment";

export function ReviewInput({ onRequestAdd, onRequestCancel }) {
  const [text, setText] = React.useState("");

  return (
    <Base pt={1}>
      <TextInput
        multiline
        underlineColorAndroid="transparent"
        autoFocus
        maxLength={300}
        value={text}
        style={{
          flex: 1,
          height: 80,
          paddingHorizontal: 16,
          paddingVertical: 16,
          textAlignVertical: "top",
          fontSize: 16,
          lineHeight: 20
        }}
        placeholder={"Your notes"}
        onChangeText={text => setText(text)}
      />
      <Base p={2} row justify="space-between" alignItems="center">
        <Base row>
          <Base flex={1} />
          <Button
            small
            mr={1}
            onPress={() => {
              LayoutAnimation.spring();
              onRequestCancel();
            }}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              const review = {
                _id: shortid.generate(),
                date: moment.utc().format(),
                value: text,
                rating: null
              };

              onRequestAdd(review);
            }}
            disabled={!text}
            small
            intent="primary"
          >
            Post Review
          </Button>
        </Base>
      </Base>
    </Base>
  );
}
