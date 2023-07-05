import * as React from "react";
import { OSBRepository, RepositoryType } from "../../apiclient/workspaces";
import MarkdownViewer from "../common/MarkdownViewer";

export const RepositoryMarkdownViewer = ({
  text,
  repository,
  className,
}: {
  text: string;
  repository?: OSBRepository;
  className?: string;
}) => {

  const getImages = (str: string) => {
    const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
    const imageTags: string[] = [];
    const imagePaths: string[] = [];
    let img;

    // tslint:disable-next-line: no-conditional-assignment
    while ((img = imgRex.exec(str))) {
      if (!img[1].startsWith("http")) {
        imageTags.push(img[0]);
        imagePaths.push(img[1]);
      }
    }
    return [imageTags, imagePaths];
  };

  const convertImgInMarkdown = (markDown: string) => {
    let mark = markDown;
    const [imageTags, imagePaths] = getImages(markDown);
    const updatedImages: string[] = [];
    imageTags.map((tag, index) => {
      mark = mark.replace(
        tag,
        `[![img](${
          repository.uri.replace(
            "https://github.com/",
            "https://raw.githubusercontent.com/"
          ) +
          "/" +
          repository.defaultContext +
          "/" +
          imagePaths[index]
        })](${
          repository.uri.replace(
            "https://github.com/",
            "https://raw.githubusercontent.com/"
          ) +
          "/" +
          repository.defaultContext +
          "/" +
          imagePaths[index]
        })`
      );
    });
    for (let i = 0; i < updatedImages.length; i++) {
      mark = mark.replace(imageTags[i], updatedImages[i]);
    }
    return mark;
  };

  return (
    <MarkdownViewer className={className}>
       {typeof repository !== "undefined" &&
        repository.repositoryType === RepositoryType.Github
          ? convertImgInMarkdown(text)
          : text}
    </MarkdownViewer>
  );
};

export default RepositoryMarkdownViewer;
