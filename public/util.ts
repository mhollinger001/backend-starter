type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

const operations: operation[] = [
  {
    name: "Delete Lesson",
    endpoint: "api/lesson/",
    method: "DELETE",
    fields: { _id: "input" },
  },
  {
    name: "Remove Sublesson from Lesson",
    endpoint: "api/lesson/remove/:_id",
    method: "PATCH",
    fields: { _id: "input", subLesson: "input" },
  },
  {
    name: "Add Sublesson To Lesson",
    endpoint: "api/lesson/add/:_id",
    method: "PATCH",
    fields: { _id: "input", subLesson: "input", location: "input" },
  },
  {
    name: "Get Lesson",
    endpoint: "api/lesson/:_id",
    method: "GET",
    fields: { _id: "input" },
  },
  {
    name: "Create Lesson",
    endpoint: "api/lesson",
    method: "POST",
    fields: { title: "input" },
  },
  {
    name: "Delete Video",
    endpoint: "api/video/",
    method: "DELETE",
    fields: { _id: "input" },
  },
  {
    name: "Update Video",
    endpoint: "api/video/:_id",
    method: "PATCH",
    fields: { _id: "input", update: { title: "input", videoUrl: "input" } },
  },
  {
    name: "Get Video",
    endpoint: "api/video/:_id",
    method: "GET",
    fields: { _id: "input" },
  },
  {
    name: "Create Video",
    endpoint: "api/video",
    method: "POST",
    fields: { title: "input", videoUrl: "input" },
  },
  {
    name: "Delete Exercise",
    endpoint: "api/exercise/",
    method: "DELETE",
    fields: { _id: "input" },
  },
  {
    name: "Remove Question from Exercise",
    endpoint: "api/exercise/remove/:_id",
    method: "PATCH",
    fields: { _id: "input", question: "input" },
  },
  {
    name: "Add Question To Exercise",
    endpoint: "api/exercise/add/:_id",
    method: "PATCH",
    fields: { _id: "input", question: "input", location: "input" },
  },
  {
    name: "Get Exercise",
    endpoint: "api/exercise/:_id",
    method: "GET",
    fields: { _id: "input" },
  },
  {
    name: "Create Exercise",
    endpoint: "api/exercise",
    method: "POST",
    fields: { title: "input" },
  },
  
  {
    name: "Delete Question",
    endpoint: "api/question/",
    method: "DELETE",
    fields: { _id: "input" },
  },
  {
    name: "Update Question",
    endpoint: "api/question/:_id",
    method: "PATCH",
    fields: { _id: "input", update: { question: "input", answerType: "input", answer: "input" } },
  },
  {
    name: "Get Question",
    endpoint: "api/question/:_id",
    method: "GET",
    fields: { _id: "input" },
  },
  {
    name: "Create Question",
    endpoint: "api/question",
    method: "POST",
    fields: { question: "input", answerType: "input", answer: "input" },
  },
  {
    name: "Get Comments (empty for all)",
    endpoint: "api/comments/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Get Replies To A Comment",
    endpoint: "api/reply/:_id",
    method: "GET",
    fields: { _id: "input" },
  },
  {
    name: "Create Comment",
    endpoint: "api/comments",
    method: "POST",
    fields: { content: "input", parentId: "input" },
  },
  {
    name: "Delete ALL Comments",
    endpoint: "api/comments",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update User",
    endpoint: "/api/users",
    method: "PATCH",
    fields: { update: { username: "input", password: "input" } },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Get Posts (empty for all)",
    endpoint: "/api/posts",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Create Post",
    endpoint: "/api/posts",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Post",
    endpoint: "/api/posts/:id",
    method: "PATCH",
    fields: { id: "input", update: { content: "input", options: { backgroundColor: "input" } } },
  },
  {
    name: "Delete Post",
    endpoint: "/api/posts/:id",
    method: "DELETE",
    fields: { id: "input" },
  },
];

// Do not edit below here.
// If you are interested in how this works, feel free to ask on forum!

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${tag} name="${prefix}${name}"></${tag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (!value) {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
