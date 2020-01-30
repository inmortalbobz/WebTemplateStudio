import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";

import { ISelectProps, IDispatchProps, IStateProps } from "./interfaces";
import {mapDispatchToProps, mapStateToProps} from "./store";
import styles from "./styles.module.css";
import { getSvg } from "../../../utils/getSvgUrl";
import DependencyInfo from "../../DependencyInfo";
import messages from "./messages";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../utils/constants";
import { injectIntl, InjectedIntlProps } from "react-intl";
import { ReactComponent as Check } from "../../../assets/check.svg";
import { getLatestVersion } from "../../../utils/extensionService/extensionService";
import vscodeApi from "../../../reducers/vscodeApiReducer";
//import Notification from "../../../components/Notification";

type Props = ISelectProps & IDispatchProps & IStateProps & InjectedIntlProps;

const FrameworkCard = (props:Props) => {
  const { framework, setFrontendSelect, frontEndSelect,
    setBackendSelect, backEndSelect, isFrontEnd, intl, setDetailPage, vscode } = props;

  const [selected, setSelected] = React.useState(false);
  const [isLatestVersion, setIsLatestVersion] = React.useState(false);

  React.useEffect(()=>{
    selectWhenLoadWithoutSelection();
    getLatestVersion(vscode, framework.internalName).then((latestVersion:boolean)=>{
      //console.log('comp' + latestVersion);
      setIsLatestVersion(latestVersion);
    });
  },[]);

  React.useEffect(()=>{
    if (isFrontEnd) setSelected(frontEndSelect.internalName === framework.internalName);
  },[frontEndSelect]);

  React.useEffect(()=>{
    if (!isFrontEnd) setSelected(backEndSelect.internalName === framework.internalName);
  },[backEndSelect]);

  const selectWhenLoadWithoutSelection = () => {
    const frameworkSelectableFirstTime = isFrontEnd ?
      frontEndSelect.internalName==="" && framework.internalName === "React":
      backEndSelect.internalName==="" && framework.internalName === "Node";

    if (frameworkSelectableFirstTime)
      selectCard();
  }

  const selectCard = ()=>{
    const { title, internalName, licenses, author, version } = framework;
    const shorthandVersionLabel = `v${version || "1.0"}`;
    const selectedFramework = {
      internalName,
      title: title as string,
      version: shorthandVersionLabel,
      licenses,
      author
    };
    if (isFrontEnd){
      setFrontendSelect(selectedFramework);
    }else{
      setBackendSelect(selectedFramework);
    }
  }

  const detailsClickWrapper = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setDetailPage(framework);
  }

  return (
    <div
    role="button"
    tabIndex={0}
    onClick={selectCard}
    className={classNames(styles.container, styles.boundingBox, {
      [styles.selected]: selected
    })}>
    <div>
      <div className={styles.gridLayoutCardHeader}>
        <div>
          {getSvg(framework.internalName, styles.icon) ||
            (framework.svgUrl && (
              <img src={framework.svgUrl} alt="" />
            ))}
        </div>
        <div className={classNames({
          [styles.title]: framework.svgUrl,
          [styles.titleLeftJustified]: framework.svgUrl === undefined ? true : false
          })}>
          {framework.title}
        </div>
      </div>

      <div className={styles.gridLayoutVersion}>
        <div className={styles.version}>v{framework.version}</div>
        {isLatestVersion &&
          (<div className={styles.latestVersion}>{isLatestVersion}(Latest)</div>)
        }
      </div>
      <div className={styles.description}>
        {framework.body}
      </div>
      <div className={styles.DependencyInfo}>
        <DependencyInfo frameworkName={framework.internalName} />
      </div>
      <div className={styles.gridLayoutCardFooter}>
        <Link
          onClick={detailsClickWrapper}
          className={styles.link}
          to={ROUTES.PAGE_DETAILS}>
          {intl.formatMessage(messages.learnMore)}
        </Link>
        {selected && (<Check className={styles.iconCheckMark} />)}
      </div>
    </div>
  </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FrameworkCard));