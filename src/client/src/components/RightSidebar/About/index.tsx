import * as React from "react";
import { useSelector } from "react-redux";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { IVersions } from "../../../types/version";

import { AppState } from "../../../store/combineReducers";
import { WEB_TEMPLATE_STUDIO_LINKS } from "../../../utils/constants/constants";

import messages from "./messages";
import styles from "./styles.module.css";

type Props = InjectedIntlProps;

const About = ({ intl }: Props) => {
  const versions: IVersions = useSelector((state: AppState) => state.config.versions);
  const { templatesVersion, wizardVersion } = versions;
  const { formatMessage } = intl;
  return (
    <div className={styles.container}>
      <div className={styles.title}>{formatMessage(messages.title)}</div>
      <div>
        <a
          href={WEB_TEMPLATE_STUDIO_LINKS.REPO}
          target={"_blank"}
          rel="noreferrer noopener"
        >
          {formatMessage(messages.visitRepo)}
        </a>
      </div>
      <div>
        <a
          target={"_blank"}
          rel="noreferrer noopener"
          href={WEB_TEMPLATE_STUDIO_LINKS.ISSUES}
        >
          {formatMessage(messages.reportIssue)}
        </a>
      </div>
      <br />

      <div>{formatMessage(messages.templatesVersion) + ` ${templatesVersion}`}</div>
      <div>{formatMessage(messages.wizardVersion) + ` ${wizardVersion}`}</div>
    </div>
  );
};

export default injectIntl(About);
