import { Text } from "@radix-ui/themes";
import { Tree } from "./Tree";

export const ViewInterview = ({ data }: { data: any }) => {
  return (
    <div>
      <Text size="8">View </Text>
      {data?.map((field, id) => {
        return (
          <Tree key={id} content={field.title}>
            {field.questions?.map((question, questionId) => {
              return (
                <Tree key={id + questionId} content={`${question.content}`} />
              );
            })}
          </Tree>
        );
      })}
    </div>
  );
};
