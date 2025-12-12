import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

export async function writeNdef({type, value}) {
  let result = false;

  try {
    // STEP 1
    await NfcManager.requestTechnology(NfcTech.Ndef);

    const bytes = Ndef.encodeMessage([Ndef.textRecord('Hello NFC')]);

    if (bytes) {
      await NfcManager.ndefHandler // STEP 2
        .writeNdefMessage(bytes); // STEP 3
      result = true;
    }
  } catch (ex) {
    console.warn(ex);
  } finally {
    // STEP 4
    NfcManager.cancelTechnologyRequest();
  }

  return result;
}


export async function readMifare() {
  let decoded = null;

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef, {
      alertMessage: 'Hold your iPhone over your thing.',
    });

    const tag = await NfcManager.getTag();
    console.warn('Tag found', tag);

    if (!tag.ndefMessage || tag.ndefMessage.length === 0) {
      console.warn('No NDEF message found');
      return null;
    }

    const record = tag.ndefMessage[0];
    decoded = Ndef.text.decodePayload(record.payload);
    return decoded;

  } catch (ex) {
    console.warn('Oops!', ex);
    throw ex;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}



