"use client";

import { Modal, type ModalProps } from "antd";
import type { CSSProperties } from "react";
import { Icon } from "@/shared/components/Icon";
import styles from "./DarkModal.module.scss";

export interface DarkModalProps extends Omit<ModalProps, "title" | "style"> {
  bg?: string;
  title?: ModalProps["title"];
  style?: CSSProperties;
}

function cx(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function DarkModal({
  bg = "#161616",
  className,
  wrapClassName,
  closeIcon,
  title = null,
  footer = null,
  destroyOnHidden = true,
  style,
  children,
  ...rest
}: DarkModalProps) {
  return (
    <Modal
      {...rest}
      title={title}
      footer={footer}
      destroyOnHidden={destroyOnHidden}
      wrapClassName={cx(styles.wrap, wrapClassName)}
      className={cx(styles.modal, className)}
      closeIcon={closeIcon ?? <Icon name="close" size={20} color="#e4e6eb" />}
      style={{ ...(style ?? {}), ["--dark-modal-bg" as string]: bg }}
    >
      {children}
    </Modal>
  );
}
