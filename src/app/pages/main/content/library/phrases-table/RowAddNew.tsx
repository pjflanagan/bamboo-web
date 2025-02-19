
import React, { FC, useState } from 'react';
import { connect } from 'react-redux';

import { LibraryActions } from 'app/redux';
import { Row, Col, CellText, CellTextArea, CellSuggest } from 'app/elements';
import { makeNewPhrase, Phrase, Mongodb, isSet, DBPhraseInterface, DBPhrase } from 'app/classes'

import { AutofillCover, ColProgressLarge, ColOptions } from './shared';
import Style from './style.module.scss';

type RowAddNewProps = {
  appendNewPhrase: (newPhrases: DBPhraseInterface) => void
}

const newPhrase = makeNewPhrase();

const RawRowAddNew: FC<RowAddNewProps> = ({ appendNewPhrase }) => {

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

  const create = async () => {
    const insertableData = phrase.makeStorableData()
    const savedPhraseData = await Mongodb.createPhrase(insertableData);
    appendNewPhrase({ ...insertableData, _id: savedPhraseData.insertedId });
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
        <CellText
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
        <CellText
          className={Style.cellPinyin}
          value={phrase.pinyin}
          name="pinyin"
          onChange={updateField}
          placeholder="pinyin"
        />
      </Col>
      <Col className={Style.colPack}>
        <CellSuggest
          name="pack"
          onChange={updateField}
          value={phrase.pack}
          options={[
            { value: '', label: 'None' },
            { value: 'option', label: 'Option' },
            // { value: phrase.pack, label: phrase.pack }
          ]}
        />
      </Col>
      <Col className={Style.colEnglish}>
        <CellTextArea
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
        save={create}
        isEdited={isEdited}
        isSaveable={isSaveable}
        cycleStatus={cycleStatus}
        progress={phrase.progress}
      />
    </Row>
  );
}

const mapDispatchToProps = (dispatch: any) => ({
  appendNewPhrase: (newPhrase: DBPhraseInterface) => {
    dispatch(LibraryActions.appendNewPhrase(new DBPhrase(newPhrase)))
  }
});


export const RowAddNew = connect(null, mapDispatchToProps)(RawRowAddNew);