
import React, { FC, useState } from 'react';

import { Row, Col, TextCell, TextAreaCell } from 'app/elements';
import { makeNewPhrase, Phrase, Mongodb, isSet } from 'app/classes'

import { AutofillCover, ColProgressLarge, ColOptions } from './shared';
import Style from './style.module.scss';

type RowAddNewProps = {
}

const newPhrase = makeNewPhrase()

export const RowAddNew: FC<RowAddNewProps> = () => {

  const [phrase, setPhrase] = useState<Phrase>(newPhrase);
  const [enableAutofillFromFocus, setEnableAutofillFromFocus] = useState(false);


  const canAutoFill = enableAutofillFromFocus && phrase.canAutoFill();
  const isEdited = phrase.isEdited(newPhrase);
  const isSaveable = phrase.isSaveable(newPhrase);

  const updateField = (e: any) => {
    setPhrase(phrase.set(`${e.target.name}`, e.target.value));
  }

  const cycleStatus = () => {
    setPhrase(phrase.cycleStatus());
  }

  const cancel = () => {
    setPhrase(makeNewPhrase());
  }

  const remove = () => {
    console.log('remove');
  }

  const save = () => {
    // TODO: TODO: TODO:
    cancel();
  }

  const autofill = async () => {
    if (!phrase.canAutoFill()) {
      return;
    }
    // get the pinyin and english for these characters
    const characters = await Mongodb.getCharacters(phrase.characters);

    // edit the phrase to include the new phrases
    const newPhrase = phrase.autofill(characters, {
      pinyin: !isSet(phrase.pinyin),
      english: !isSet(phrase.english)
    });
    setPhrase(newPhrase);
  }

  return (
    <Row backgroundFill={phrase.progress} className={`${Style.rowAddNew} ${Style.rowPhrase}`}>
      <div className={Style.cover}>
        <AutofillCover
          visible={canAutoFill}
          pinyin={phrase.pinyin}
          english={phrase.english}
        />
      </div>
      <Col className={Style.colChinese}>
        <TextCell
          className={Style.cellChinese}
          value={phrase.characters}
          name="characters"
          onChange={updateField}
          placeholder="新的"
          onReturn={autofill}
          onFocus={() => setEnableAutofillFromFocus(true)}
          onBlur={() => setEnableAutofillFromFocus(false)}
        />
      </Col>
      <Col className={Style.colPinyin}>
        <TextCell
          className={Style.cellPinyin}
          value={phrase.pinyin}
          name="pinyin"
          onChange={updateField}
          placeholder="pinyin"
        />
      </Col>
      <Col className={Style.colEnglish}>
        <TextAreaCell
          className={Style.cellEnglish}
          value={phrase.english}
          name="english"
          onChange={updateField}
          placeholder="english definition"
        />
      </Col>
      <ColProgressLarge progress={phrase.progress} updateField={updateField} />
      <ColOptions
        cancel={cancel}
        save={save}
        remove={remove}
        isEdited={isEdited}
        isSaveable={isSaveable}
        cycleStatus={cycleStatus}
        progress={phrase.progress}
      />
    </Row>
  );
}
