import React, { MouseEvent, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { SessionAPI } from "../../utils/api";
import { AxiosError, AxiosResponse } from "axios";
import "./style.css"

const AssignModal = (props: any): object => {
  const session: object = props.session;
  const allSess: object[] = props.allSess;
  const [errThrown, setErrThrown] = useState<string>()


  // Modal variables
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  // Sets boolean to show or hide relevant modal
  const handleShowSuccess = () => setShowSuccess(true);
  const handleHideSuccess = () => setShowSuccess(false);
  const handleShowError = () => setShowError(true);
  const handleHideError = () => setShowError(false);

  const updateSess = async (e: MouseEvent): Promise<void> => {
    e.preventDefault();
    SessionAPI.updateSession({ ...props.session }, props.session._id)
    .then((resp: AxiosResponse<object>) => {
      console.log("from assignModal updateSess", resp.data)
      // TS doesn't like resp.err
      if (resp.status !== 422) {
        handleShowSuccess();
      }
    })
    .catch((err: AxiosError) => {
      console.log(err);
      setErrThrown(err.message);
      handleShowError();
    })
  }

  return (
    <>
      <Modal show={props.show} onHide={props.hide} backdrop="static" keyboard={false} centered={true} className="modal">
        <Button data-toggle="popover" title="Assign" className="button" type="submit" onClick={updateSess}>Assign Session</Button>
      </Modal>
    </>
  )
}

export default AssignModal;