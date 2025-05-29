import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import styles from "../styles/Name.module.css";
import { useRouter } from "next/router";
import ConfettiGenerator from "confetti-js";
import messages from "../utils/birthdayWishes.js";
import useTheme from "../hooks/useTheme";
import * as htmlToImage from "html-to-image";
import FileSaver from "file-saver";
import { Button, CopyLinkButton } from "../components";

const Wish = ({ history }) => {
  const router = useRouter();
  const { name } = router.query;
  const color = name ? name[1] : 0;
  const [downloading, setDownloading] = useState(false);
  const [downloadedOnce, setDownloadedOnce] = useState(false);
  const audioRef = useRef();

  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(color);

    if (downloading === false) {
      const confettiSettings = {
        target: "canvas",
        start_from_edge: true,
      };
      const confetti = new ConfettiGenerator(confettiSettings);
      confetti.render();
      audioRef.current.play();
    }
  }, [color, downloading]);

  useEffect(() => {
    if (downloading === true && downloadedOnce === false) {
      downloadImage();
    }
  }, [downloading, downloadedOnce]);

  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const downloadImage = () => {
    if (downloadedOnce === true) return;

    const node = document.getElementById("image");

    if (node) {
      setDownloadedOnce(true);

      htmlToImage.toPng(node).then((blob) => {
        FileSaver.saveAs(blob, "birthday-wish.png");
        setDownloading(false);
      });
    }
  };

  const title = (name) => {
    const wish = "Happy Birthday " + name + "!";
    const base_letters = [];
    const name_letters = [];

    for (let i = 0; i < wish.length; i++) {
      if (i < 15) {
        const letter = wish.charAt(i);
        base_letters.push(
          <span key={i} style={{ "--i": i + 1 }}>
            {letter}
          </span>
        );
      } else {
        const letter = wish.charAt(i);
        name_letters.push(
          <span key={i} style={{ "--i": i + 1 }} className={styles.span}>
            {letter}
          </span>
        );
      }
    }

    return (
      <>
        {downloading ? (
          <h1
            className={styles.titleImg}
            style={{ "--wish-length": wish.length }}
          >
            <div>{base_letters.map((letter) => letter)}</div>
            <div>{name_letters.map((letter) => letter)}</div>
          </h1>
        ) : (
          <h1 className={styles.title} style={{ "--wish-length": wish.length }}>
            <div>{base_letters.map((letter) => letter)}</div>
            <div>{name_letters.map((letter) => letter)}</div>
          </h1>
        )}
      </>
    );
  };

  if (downloading) {
    return (
      <div className={styles.containerImg} id="image" onClick={downloadImage}>
        {downloadImage()}
        <main className={styles.image}>
          <div>
            <div className={styles.main}>{title(name && name[0])}</div>
            <div style={{ height: 40 }} />
            <p className={styles.descImg}>
              {messages[randomNumber(0, messages.length)].value}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Happy Birthday {name && name[0]}</title>
        <meta name="description" content={`A surprise birthday wish!`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <canvas className={styles.canvas} id="canvas"></canvas>

      <main className={styles.animate}>
        <div style={{ textAlign: "center" }}>
          <div className={styles.main}>{title(name && name[0])}</div>
          <p className={styles.desc}>
            {messages[randomNumber(0, messages.length)].value}
          </p>

          <video
            src="/cake2.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "300px",
              height: "auto",
              marginTop: "20px",
              borderRadius: "10px",
              display: "inline-block",
            }}
          />
        </div>

        <div className={styles.buttonContainer}>
          {history && history[0] === "/" ? <CopyLinkButton /> : null}

          {history && history[0] === "/" ? (
            <Button
              onClick={() => {
                setDownloadedOnce(false);
                setDownloading(true);
              }}
              text="Download as Image"
            />
          ) : null}

          <Button
            onClick={() => router.push("/")}
            text="&larr; Create a wish"
          />
        </div>
      </main>

      <audio ref={audioRef} id="player" autoPlay>
        <source src="media/hbd.mp3" />
      </audio>
    </div>
  );
};

export default Wish;
